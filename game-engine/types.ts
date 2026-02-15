/**
 * Core data models for Family Game Night.
 * Matches docs/datamodels.md. All types are serializable for local storage and Bluetooth sync.
 */

// --- 1. Identifiers ---
export type PlayerId = string;
export type SessionId = string;
export type RoomId = string;
export type LobbyId = string;
export type DeviceId = string;

// --- 2. Player (canonical / synced) ---
export interface Player {
  id: PlayerId;
  displayName: string;
  order: number; // 0-based turn order
}

// --- UserSettings (local preferences, not synced) ---
export interface UserSettings {
  difficulty: number;
  displayName: string;
  myColor: string;
  opponent1Color: string;
}

// --- 3. Game session ---
export type GameMode = "single" | "singleDevice" | "multiDevice";
export type GameType = "tic-tac-toe" | "dots" | "connect4";

export type GameSessionStatus = "active" | "winner" | "draw";

export interface GameSession {
  id: SessionId;
  gameType: GameType;
  mode: GameMode;
  players: Player[];
  state: GameState;
  currentTurnIndex: number;
  status: GameSessionStatus;
  winnerIndex?: number;
  createdAt: number;
  lastActionAt?: number;
}

// --- Per-game state (discriminated union) ---
export interface TicTacToeState {
  gameType: "tic-tac-toe";
  board: (PlayerId | null)[][];
  lastMove?: { row: number; col: number };
}

export interface DotsState {
  gameType: "dots";
  rows: number;
  cols: number;
  lines: string[];
  boxes: Record<string, PlayerId>;
  lastLine?: string;
  lastMovePlayerIndex?: number;
}

export interface Connect4State {
  gameType: "connect4";
  rows: number;
  cols: number;
  columns: (PlayerId | null)[][];
  lastDrop?: { col: number; row: number };
}

export type GameState = TicTacToeState | DotsState | Connect4State;

// --- 4. Lobby ---
export interface GameSettings {
  gridRows?: number;
  gridCols?: number;
  rows?: number;
  cols?: number;
  [key: string]: unknown;
}

export type LobbyStatus = "waiting" | "starting";

export interface Lobby {
  roomId: RoomId;
  hostDeviceId: DeviceId;
  gameType: GameType;
  gameSettings: GameSettings;
  joinedPlayers: Player[];
  status: LobbyStatus;
  createdAt: number;
}

// --- 5. Per-game actions ---
export type TicTacToeAction = {
  type: "PLACE";
  row: number;
  col: number;
  playerId?: PlayerId; // set by runner when dispatching; required when received over sync
};

export type DotsAction = {
  type: "DRAW_LINE";
  edgeKey: string;
  playerId?: PlayerId;
};

export type Connect4Action = {
  type: "DROP";
  col: number;
  playerId?: PlayerId;
};

export type GameAction = TicTacToeAction | DotsAction | Connect4Action;

// --- 6. Sync / Bluetooth message types ---
export type LobbyMessage =
  | { type: "LOBBY_CREATE"; lobby: Lobby }
  | { type: "LOBBY_JOIN"; roomId: RoomId; player: Player }
  | { type: "LOBBY_LEAVE"; playerId: PlayerId }
  | { type: "LOBBY_SETTINGS"; gameSettings: GameSettings }
  | { type: "LOBBY_START"; session: GameSession };

export type GameMessage =
  | { type: "ACTION"; action: GameAction }
  | { type: "FULL_STATE"; session: GameSession }
  | { type: "GAME_OVER"; session: GameSession };
