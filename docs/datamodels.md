# Family Game Night — Data Models

This document defines the core data shapes for sessions, players, lobbies, and each game type. All models are serializable so they can be stored locally and sent over Bluetooth when needed.

---

## 1. Identifiers

- **PlayerId**: string (e.g. UUID or device-derived id for multi-device).
- **SessionId**: string (unique per game session).
- **RoomId / LobbyId**: string (multi-device lobby before game start).
- **DeviceId**: string (for Bluetooth identity and host/peer mapping).

---

## 2. Player (canonical / synced)

Minimal data that is shared across devices. Names can be sent at lobby join; colors are **not** synced (local override only).

```ts
interface Player {
  id: PlayerId;
  displayName: string;   // optional default "Player 1", "Player 2"
  order: number;        // 0-based turn order
}
```

**Local preferences (persisted on this device; not synced):**

For MVP we store **display name** (this user’s chosen name; no validation, duplicates OK) and **slot-based colors** so each device can render “me” and “opponent” in its own colors:

```ts
interface UserSettings {
  difficulty: number;        // e.g. 1–10 or easy/medium/hard for AI
  displayName: string;      // e.g. default "Player 1"; no validation, duplicates OK
  myColor: string;          // Crayola 8 hex — how "me" is shown on this device
  opponent1Color: string;   // how "opponent" (or Opponent 1) is shown on this device
  // Later: opponent2Color, etc. if we add more players
}
```

The same UI component for choosing name and color is used in **Settings** (labels: “Display name”, “My color”, “Opponent 1 color”) and **in-game** (generic labels: “Player 1”, “Player 2” or “You”, “Opponent”).

---

## 3. Game session (runtime)

Represents one active or finished game. Used by the game shell and engine.

```ts
type GameMode = 'single' | 'singleDevice' | 'multiDevice';
type GameType = 'tic-tac-toe' | 'dots' | 'connect4';

interface GameSession {
  id: SessionId;
  gameType: GameType;
  mode: GameMode;
  players: Player[];           // ordered; for single-player, second player is "AI"
  state: GameState;            // union per game type, see below
  currentTurnIndex: number;    // index into players
  status: 'active' | 'winner' | 'draw';
  winnerIndex?: number;        // when status === 'winner'
  createdAt: number;           // timestamp
  lastActionAt?: number;
}
```

`GameState` is a discriminated union:

```ts
type GameState = TicTacToeState | DotsState | Connect4State;
```

---

## 4. Lobby (multi-device, pre-game)

Only used when mode is `multiDevice` and the host is waiting for players.

```ts
interface Lobby {
  roomId: RoomId;
  hostDeviceId: DeviceId;
  gameType: GameType;
  gameSettings: GameSettings;   // game-specific (e.g. grid size for Dots)
  joinedPlayers: Player[];      // host + peers, in join order
  status: 'waiting' | 'starting';
  createdAt: number;
}
```

**GameSettings** (examples; extend per game):

```ts
interface GameSettings {
  // Dots
  gridRows?: number;
  gridCols?: number;
  // Connect4
  rows?: number;
  cols?: number;
  // Shared
  [key: string]: unknown;
}
```

**Per-game config** (defined in code per game, not user preference): each game specifies its own **paper style** (e.g. `'lined' | 'graph' | 'blank'`) and other display constants; the canvas uses this when rendering the board.

---

## 5. Per-game state and actions

### 5.1 Tic Tac Toe

**State:**

```ts
interface TicTacToeState {
  gameType: 'tic-tac-toe';
  board: (PlayerId | null)[][];   // 3x3, row-major
  lastMove?: { row: number; col: number };
}
```

**Actions:**

```ts
type TicTacToeAction =
  | { type: 'PLACE'; row: number; col: number };
```

---

### 5.2 Dots (Boxes)

Grid of dots; players take turns drawing one line (horizontal or vertical edge). When a player completes a box, they claim it and get a point; they may get another turn depending on house rules (often “complete a box → extra turn”).

**State:**

```ts
interface DotsState {
  gameType: 'dots';
  rows: number;      // number of dot rows
  cols: number;      // number of dot columns
  // Edges: for an NxM grid of dots there are (N-1)*M + N*(M-1) edges
  // Encode as set of edge keys e.g. "r,c,h" (horizontal) or "r,c,v" (vertical)
  lines: string[];   // e.g. ["0,0,h", "0,0,v"]
  // Box ownership: key "r,c" for top-left of 1x1 box, value playerId
  boxes: Record<string, PlayerId>;
  lastLine?: string; // for "highlight last move"
  lastMovePlayerIndex?: number; // who drew the last line (for extra turn rule)
}
```

**Actions:**

```ts
type DotsAction =
  | { type: 'DRAW_LINE'; edgeKey: string };
```

Edge key format can be e.g. `row,col,h` for horizontal and `row,col,v` for vertical, with row/col referring to the dot at the top-left of the edge.

---

### 5.3 Connect 4

**State:**

```ts
interface Connect4State {
  gameType: 'connect4';
  rows: number;      // e.g. 6
  cols: number;      // e.g. 7
  columns: (PlayerId | null)[][];  // columns[c][r] = bottom to top
  lastDrop?: { col: number; row: number };
}
```

**Actions:**

```ts
type Connect4Action =
  | { type: 'DROP'; col: number };
```

UI: buttons per column or drag-to-column; action is only the column index. Reducer resolves the row (first empty cell in that column).

---

## 6. Sync / Bluetooth message types

For multi-device, these are the payloads you send (e.g. JSON over a Bluetooth channel).

**Lobby:**

```ts
type LobbyMessage =
  | { type: 'LOBBY_CREATE'; lobby: Lobby }
  | { type: 'LOBBY_JOIN'; roomId: RoomId; player: Player }
  | { type: 'LOBBY_LEAVE'; playerId: PlayerId }
  | { type: 'LOBBY_SETTINGS'; gameSettings: GameSettings }
  | { type: 'LOBBY_START'; session: GameSession };
```

**In-game:**

```ts
type GameMessage =
  | { type: 'ACTION'; action: TicTacToeAction | DotsAction | Connect4Action }
  | { type: 'FULL_STATE'; session: GameSession }   // optional, for resync
  | { type: 'GAME_OVER'; session: GameSession };
```

Actions are game-type-specific; recipients use `session.gameType` to know which reducer to run.

---

## 7. Local persistence (optional)

- **Settings** (user preferences, persisted): `UserSettings` — `difficulty`, `displayName`, `myColor`, `opponent1Color`. Paper style is defined per game in game config, not stored here. Draw animation duration is a code constant.
- **Resumable game**: Store `GameSession` (and mode) so that single-device or host can “resume” after app kill (multi-device resume is harder; start with “restart game” after reconnect).

---

## 8. Summary

| Concept | Purpose |
|--------|---------|
| **Player** | Canonical id + display name + order; colors come from this device’s UserSettings (myColor / opponent1Color). |
| **GameSession** | One game instance: game type, mode, players, state, turn, status. |
| **Lobby** | Pre-game room for multi-device: host, joined players, settings, Start. |
| **GameState** | Union of TicTacToeState, DotsState, Connect4State; reducer produces next state from actions. |
| **Actions** | Typed, minimal (e.g. PLACE, DRAW_LINE, DROP); sync layer sends only actions; all devices apply same reducer. |

Keeping state and actions explicit and serializable ensures the game engine stays the single source of truth and Bluetooth only carries minimal, deterministic updates.
