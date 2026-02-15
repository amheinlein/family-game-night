# Implementation Roadmap

This roadmap breaks down implementation into discrete, atomic steps. Each step is scoped so an AI agent can complete it in a single implementation session. **Never work on more than one roadmap item at a time.** If implementation requires modifying files not listed, pause and discuss before proceeding.

---

## Phase 1: Foundation & Setup

### 1.1 Project Setup
**Status:** `not started`  
**Summary:** Initialize Expo project with TypeScript, Expo Router, and basic folder structure.

**Acceptance Criteria:**
- Expo project initialized with TypeScript template
- Expo Router installed and configured
- Folder structure created: `app/`, `components/`, `game-engine/`, `games/`, `settings/`, `constants.ts`
- Project runs on iOS/Android simulator/device
- Basic navigation works (can navigate between screens)

**Testing:**
- Run `npx expo start` (or `npx expo run:ios` / `npx expo run:android`); app launches without errors
- Home screen appears; tap "Play" and "Settings" and confirm each navigates to its placeholder screen
- Confirm folder structure exists (app/, components/, game-engine/, games/, settings/, constants.ts)

**Files to Create/Modify:**
- `package.json` (created by Expo)
- `app.json` (Expo config)
- `tsconfig.json` (TypeScript config)
- `app/_layout.tsx` (root layout with Expo Router)
- `app/index.tsx` (home screen placeholder)
- `app/settings.tsx` (settings screen placeholder)
- `app/play.tsx` (play screen placeholder)
- `.gitignore` (if not auto-generated)

---

### 1.2 Core Type Definitions
**Status:** `not started`  
**Summary:** Create TypeScript types for core data models (Player, GameSession, UserSettings, etc.) based on datamodels.md.

**Acceptance Criteria:**
- All types from `docs/datamodels.md` are defined in TypeScript
- Types are in `game-engine/types.ts` or similar
- Types compile without errors
- Types match the data model specifications exactly

**Testing:**
- Run `npx tsc --noEmit` (or start the app); TypeScript compiles without errors
- Import one or more types (e.g. `Player`, `GameSession`, `UserSettings`) in a temporary file or existing screen and confirm no type errors

**Files to Create/Modify:**
- `game-engine/types.ts` (or `types/` folder with separate files)

---

### 1.3 Constants File
**Status:** `not started`  
**Summary:** Create constants.ts with dev-facing values (draw animation duration, Crayola 8 colors, defaults).

**Acceptance Criteria:**
- `constants.ts` exists with:
  - `GAME_DRAW_ANIMATION_MS` (default: 2000)
  - `CRAYOLA_8_COLORS` array with hex codes
  - `DEFAULT_DIFFICULTY` (default: 5)
  - `DEFAULT_DISPLAY_NAME` (default: "Player 1")
  - `DEFAULT_MY_COLOR` and `DEFAULT_OPPONENT1_COLOR` (from Crayola 8)
- Constants are exported and typed

**Testing:**
- Import constants in a test file or screen (e.g. `import { GAME_DRAW_ANIMATION_MS, CRAYOLA_8_COLORS, DEFAULT_DIFFICULTY } from './constants'`) and log them; confirm values match specs
- `GAME_DRAW_ANIMATION_MS` is 2000; `CRAYOLA_8_COLORS` has 8 hex strings; `DEFAULT_MY_COLOR` and `DEFAULT_OPPONENT1_COLOR` are in the Crayola 8 set

**Files to Create/Modify:**
- `constants.ts`

---

### 1.4 Game Contract Interface
**Status:** `needs design`  
**Summary:** Define the formal TypeScript interface/type that all games must implement (reducer, validation, queries, AI strategy, metadata).

**Acceptance Criteria:**
- `game-engine/contract.ts` (or similar) defines `GameContract<TState, TAction>` interface
- Interface includes:
  - `reducer: (state: TState, action: TAction) => TState`
  - `validate: (state: TState, action: TAction) => boolean`
  - `getCurrentTurnPlayerIndex: (state: TState, players: Player[]) => number`
  - `getWinner: (state: TState, players: Player[]) => number | null`
  - `isDraw: (state: TState) => boolean`
  - `getLastMove: (state: TState) => unknown | null`
  - `getAIStrategy: (difficulty: number) => (state: TState) => TAction | null`
  - `metadata: { name: string, image: string, description?: string, paperStyle: 'lined' | 'graph' | 'blank' }`
- Interface is documented with JSDoc comments
- TypeScript compiles without errors

**Testing:**
- Run `npx tsc --noEmit`; compiles without errors
- Create a minimal test object that implements the interface (or a partial mock) and confirm it type-checks; or import the contract in another module and reference its properties

**Files to Create/Modify:**
- `game-engine/contract.ts` (or `game-engine/types.ts` if consolidating)
- `docs/game-contract.md` (documentation of the contract)

---

## Phase 2: Settings & Preferences

### 2.1 Settings Persistence Layer
**Status:** `not started`  
**Summary:** Implement reading/writing UserSettings to AsyncStorage (Expo).

**Acceptance Criteria:**
- `settings/store.ts` (or `store/settings.ts`) exists
- Functions: `loadSettings(): Promise<UserSettings>`, `saveSettings(settings: UserSettings): Promise<void>`
- Default values used if no saved settings exist
- Functions handle errors gracefully
- Settings are persisted and restored correctly

**Testing:**
- In a test file or temporary screen, call `loadSettings()` with no prior save; confirm defaults are returned
- Call `saveSettings({ ... })` with custom values, then `loadSettings()`; confirm values persisted
- Kill and restart the app; confirm saved settings are still there (or call loadSettings again in a fresh session)

**Files to Create/Modify:**
- `settings/store.ts` (or `store/settings.ts`)

---

### 2.2 Settings Screen UI
**Status:** `not started`  
**Summary:** Create Settings screen with inputs for difficulty, display name, my color, opponent1 color.

**Acceptance Criteria:**
- `app/settings.tsx` renders a form with:
  - Difficulty selector (1-10 or Easy/Medium/Hard dropdown)
  - Display name text input
  - Color picker for "My color" (Crayola 8 colors)
  - Color picker for "Opponent 1 color" (Crayola 8 colors)
- Changes are saved to persistence when user confirms
- Screen reads current settings on load
- UI is functional and navigable

**Testing:**
- Navigate to Settings from Home; confirm all four controls (difficulty, display name, my color, opponent1 color) are visible
- Change each value and save; navigate away and back; confirm settings persisted
- Change display name to "TestPlayer", save; confirm it appears when you return

**Files to Create/Modify:**
- `app/settings.tsx`
- `components/ColorPicker.tsx` (reusable color picker component)
- `components/NameInput.tsx` (optional, if extracting to component)

---

## Phase 3: Basic UI Structure

### 3.1 Home Screen
**Status:** `not started`  
**Summary:** Create home screen with Play and Settings buttons.

**Acceptance Criteria:**
- `app/index.tsx` renders home screen
- Two buttons/links: "Play" and "Settings"
- Navigation works to both screens
- Basic styling (can be minimal for MVP)

**Testing:**
- Launch app; home screen shows Play and Settings
- Tap Play; navigates to play screen
- Tap Settings; navigates to settings screen
- Use back or home navigation to return to home

**Files to Create/Modify:**
- `app/index.tsx`

---

### 3.2 Play Screen - Game Grid
**Status:** `not started`  
**Summary:** Create play screen that shows a grid of game tiles (placeholder for now, will show games once they're implemented).

**Acceptance Criteria:**
- `app/play.tsx` renders a grid/list of game tiles
- Each tile shows placeholder: game name and placeholder image
- Tiles are tappable (navigation to game menu will be added later)
- Grid is scrollable if needed
- Basic styling

**Testing:**
- Navigate to Play from Home; confirm grid of placeholder tiles appears
- Confirm each tile shows a game name and placeholder image
- Tap tiles; they should be tappable (may not navigate yet if game menu isn't wired)

**Files to Create/Modify:**
- `app/play.tsx`
- `components/GameTile.tsx` (optional, if extracting)

---

## Phase 4: Game Engine Infrastructure

### 4.1 Game Engine Core
**Status:** `not started`  
**Summary:** Implement game engine runner that can execute a game contract (reducer, validation, queries).

**Acceptance Criteria:**
- `game-engine/runner.ts` (or `engine.ts`) exists
- Functions:
  - `dispatchAction(session: GameSession, action: GameAction): GameSession | null` (returns null if invalid)
  - `getCurrentTurn(session: GameSession): Player | null`
  - `getWinner(session: GameSession): Player | null`
  - `isGameOver(session: GameSession): boolean`
- Functions use the game contract interface
- Functions handle errors gracefully
- TypeScript compiles without errors

**Testing:**
- Import runner and create a minimal test session (requires a game contract; can use Tic Tac Toe once 5.1 exists, or a stub). Call `dispatchAction` with a valid action; confirm new state returned. Call with invalid action; confirm `null` returned
- Call `getCurrentTurn`, `getWinner`, `isGameOver` on known states; confirm results match expectations

**Files to Create/Modify:**
- `game-engine/runner.ts` (or `game-engine/engine.ts`)

---

### 4.2 Game Registry
**Status:** `not started`  
**Summary:** Create a registry that maps gameType strings to game contract instances.

**Acceptance Criteria:**
- `game-engine/registry.ts` exists
- Functions: `registerGame(gameType: GameType, contract: GameContract)`, `getGame(gameType: GameType): GameContract | null`
- Registry can be populated with games
- Registry returns correct game for a given gameType

**Testing:**
- Import registry; call `getGame('tic-tac-toe')` before any game is registered; confirm returns `null`
- After Tic Tac Toe is registered (5.1), call `getGame('tic-tac-toe')`; confirm returns the Tic Tac Toe contract with correct metadata (e.g. `metadata.name === 'Tic Tac Toe'`)

**Files to Create/Modify:**
- `game-engine/registry.ts`

---

## Phase 5: First Game - Tic Tac Toe (Single Player)

### 5.1 Tic Tac Toe Game Contract
**Status:** `not started`  
**Summary:** Implement Tic Tac Toe game contract (reducer, validation, queries, AI strategy, metadata).

**Acceptance Criteria:**
- `games/tic-tac-toe/index.ts` (or `contract.ts`) exports TicTacToeContract
- Implements all required contract methods:
  - Reducer handles `{ type: 'PLACE', row: number, col: number }` actions
  - Validation rejects invalid moves (out of bounds, cell already occupied, wrong turn)
  - Queries return correct values (current turn, winner, draw, last move)
  - AI strategy (simple for MVP: random valid move)
  - Metadata: name "Tic Tac Toe", paperStyle 'lined'
- Contract is registered in game registry
- TypeScript compiles without errors

**Testing:**
- Import TicTacToeContract; call reducer with initial state and `{ type: 'PLACE', row: 0, col: 0 }`; confirm cell updated
- Call validate with invalid move (e.g. out of bounds, same cell twice); confirm returns false
- Play a winning sequence via reducer; call getWinner; confirm correct player index
- Call getGame('tic-tac-toe') from registry; confirm returns Tic Tac Toe contract

**Files to Create/Modify:**
- `games/tic-tac-toe/index.ts` (or `games/tic-tac-toe/contract.ts`)
- `games/tic-tac-toe/reducer.ts` (optional, if splitting)
- `games/tic-tac-toe/validation.ts` (optional, if splitting)
- `games/tic-tac-toe/queries.ts` (optional, if splitting)
- `games/tic-tac-toe/ai.ts` (optional, if splitting)
- `games/tic-tac-toe/metadata.ts` (optional, if splitting)
- `game-engine/registry.ts` (register the game)

---

### 5.2 Tic Tac Toe UI Component
**Status:** `not started`  
**Summary:** Create Tic Tac Toe board UI component that renders the 3x3 grid and handles touch input.

**Acceptance Criteria:**
- `components/games/TicTacToeBoard.tsx` exists
- Renders 3x3 grid of cells
- Cells show X/O (or colored markers) based on state
- Cells are tappable; on tap, dispatches `{ type: 'PLACE', row, col }` action
- Board updates when state changes
- Basic styling (can be minimal, paper aesthetic can come later)

**Testing:**
- Render TicTacToeBoard in a test screen or game screen; confirm 3x3 grid displays
- Tap empty cells; confirm markers appear and board updates
- Tap occupied cell; confirm no change (or invalid move handled)

**Files to Create/Modify:**
- `components/games/TicTacToeBoard.tsx`

---

### 5.3 Game Screen Shell
**Status:** `not started`  
**Summary:** Create game screen that orchestrates game session, renders game board, handles turn indicators, and manages AI turns.

**Acceptance Criteria:**
- `app/play/[gameId]/game.tsx` exists (or `app/game/[gameId].tsx`)
- Screen:
  - Creates/loads GameSession with correct gameType and mode
  - Renders game board component (Tic Tac Toe for now)
  - Shows turn indicator (current player)
  - Handles user actions (dispatches to game engine)
  - Detects AI turn and dispatches AI action automatically
  - Shows game over state (winner/draw)
  - Uses React Context + useReducer for session state (per state-management decision)
- Screen works for single-player mode (human vs AI)
- TypeScript compiles without errors

**Testing:**
- Navigate to Tic Tac Toe game screen (via play grid or direct URL)
- Play a move; confirm your marker appears; confirm AI responds with a move
- Play until win or draw; confirm "game over" state shows (winner name or "Draw")
- Confirm turn indicator updates (your turn vs AI turn)

**Files to Create/Modify:**
- `app/play/[gameId]/game.tsx` (or `app/game/[gameId].tsx`)
- `components/GameShell.tsx` (optional, if extracting shell logic)
- `components/TurnIndicator.tsx` (optional, if extracting)

---

### 5.4 Game Menu Screen
**Status:** `not started`  
**Summary:** Create game menu screen that shows options: Single Player, Multi-Player 1 device, Multi-Player multiple devices.

**Acceptance Criteria:**
- `app/play/[gameId]/index.tsx` (or `app/play/[gameId]/menu.tsx`) exists
- Screen shows three buttons/options:
  - "Single Player"
  - "Multi-Player 1 Device"
  - "Multi-Player Multiple Devices"
- Each option navigates to game screen with correct mode
- Screen reads game metadata to show game name
- Basic styling

**Testing:**
- From Play screen, tap Tic Tac Toe tile; confirm game menu appears with three options and game name
- Tap "Single Player"; confirm navigates to game screen and starts single-player game
- (Multi-player options may not be fully functional yet; confirm navigation at least works)

**Files to Create/Modify:**
- `app/play/[gameId]/index.tsx` (or `app/play/[gameId]/menu.tsx`)

---

### 5.5 Update Play Screen to Show Games
**Status:** `not started`  
**Summary:** Update play screen to show actual games from registry instead of placeholders.

**Acceptance Criteria:**
- `app/play.tsx` reads games from game registry
- Shows Tic Tac Toe tile with name and image (if available)
- Tapping tile navigates to game menu
- Grid updates when new games are registered

**Testing:**
- Navigate to Play; confirm Tic Tac Toe tile appears (with name and image)
- Tap Tic Tac Toe; confirm navigates to game menu
- End-to-end: Home → Play → Tic Tac Toe → Single Player → play a game of Tic Tac Toe vs AI

**Files to Create/Modify:**
- `app/play.tsx`

---

## Phase 6: Single-Device Multiplayer

### 6.1 Pass-and-Play Mode Support
**Status:** `not started`  
**Summary:** Update game screen to support single-device multiplayer mode (pass-and-play).

**Acceptance Criteria:**
- Game screen handles `mode: 'singleDevice'` correctly
- No AI turns in single-device mode
- Turn indicator shows current player correctly
- Players can take turns by tapping the board
- Game works correctly with 2+ human players

**Testing:**
- From game menu, select "Multi-Player 1 Device"; confirm game starts with no AI
- Take turns: tap cell for Player 1, then Player 2; confirm turn indicator flips
- Play a full game; confirm winner or draw is shown correctly

**Files to Create/Modify:**
- `app/play/[gameId]/game.tsx` (or `app/game/[gameId].tsx`)
- `components/GameShell.tsx` (if extracted)

---

## Phase 7: Player Colors & Display Names

### 7.1 Player Color Mapping Logic
**Status:** `not started`  
**Summary:** Implement logic to map players to colors based on UserSettings (myColor, opponent1Color) and game mode.

**Acceptance Criteria:**
- `settings/colorMapping.ts` (or similar) exists
- Function: `getPlayerColor(player: Player, session: GameSession, myPlayerId: PlayerId | null, settings: UserSettings): string`
- Logic:
  - Single-player: player[0] uses myColor, player[1] (AI) uses opponent1Color
  - Single-device: uses generic colors (Player 1, Player 2) or settings if applicable
  - Multi-device: if player.id === myPlayerId, use myColor; else use opponent1Color
- Function is tested/works correctly for all modes

**Testing:**
- Change "My color" and "Opponent 1 color" in Settings; start single-player Tic Tac Toe; confirm your markers use myColor and AI uses opponent1Color
- Start single-device game; confirm both players have distinct colors
- (Multi-device: test after 8.6 when color mapping is integrated)

**Files to Create/Modify:**
- `settings/colorMapping.ts` (or `game-engine/colorMapping.ts`)

---

### 7.2 Player Display Name Logic
**Status:** `not started`  
**Summary:** Implement logic to get display name for a player (from Player.displayName or UserSettings.displayName).

**Acceptance Criteria:**
- Function: `getPlayerDisplayName(player: Player, settings: UserSettings): string`
- Logic: if player.id matches this device's player (in single-player or multi-device), use settings.displayName; else use player.displayName
- Function works correctly for all modes

**Testing:**
- Set display name to "Alex" in Settings; start single-player game; confirm "Alex" (or similar) appears for your player in the turn indicator / player strip
- In single-device mode, confirm player names are shown (e.g. "Player 1", "Player 2" or your display name)

**Files to Create/Modify:**
- `settings/nameMapping.ts` (or consolidate with colorMapping.ts)

---

### 7.3 Player Strip Component
**Status:** `not started`  
**Summary:** Create player strip component that shows player names and colors, with tap to change color (same component used in Settings and in-game).

**Acceptance Criteria:**
- `components/PlayerStrip.tsx` exists
- Component accepts props: `players: Player[]`, `session: GameSession`, `settings: UserSettings`, `onColorChange?: (playerId: PlayerId, color: string) => void`, `labels?: { player1: string, player2: string }` (for generic vs "My color" labels)
- Renders player names and color indicators
- Tapping a player opens color picker (if onColorChange provided)
- Component works in Settings screen (with "My color", "Opponent 1 color" labels)
- Component works in-game (with "Player 1", "Player 2" or "You", "Opponent" labels)
- Color changes persist to settings when used in Settings screen

**Testing:**
- In Settings, confirm PlayerStrip shows "My color" and "Opponent 1 color" with color swatches; tap each, change color, save; confirm persisted
- In a game (single-player or single-device), confirm PlayerStrip shows player names and colors
- Change color in-game (if supported); confirm board markers update

**Files to Create/Modify:**
- `components/PlayerStrip.tsx`
- `app/settings.tsx` (integrate PlayerStrip)
- `app/play/[gameId]/game.tsx` (integrate PlayerStrip)

---

## Phase 8: Multi-Device (Bluetooth)

### 8.1 Bluetooth Library Evaluation & Decision
**Status:** `needs design`  
**Summary:** Evaluate Bluetooth libraries (react-native-ble-phone-to-phone, react-native-ble-plx + react-native-multi-ble-peripheral) and document choice.

**Acceptance Criteria:**
- `docs/decisions/bluetooth-implementation.md` created
- Documents chosen library
- Documents BLE service UUIDs and characteristic UUIDs
- Documents message serialization format (JSON)
- Documents device identification strategy
- Documents connection lifecycle (when to disconnect, reconnect behavior)

**Testing:**
- Read the decision doc; confirm it answers: which library, which UUIDs, how messages are serialized, how devices identify each other, when connection drops

**Files to Create/Modify:**
- `docs/decisions/bluetooth-implementation.md`

---

### 8.2 Bluetooth Sync Layer - Discovery
**Status:** `not started`  
**Summary:** Implement Bluetooth discovery (Host advertises, Join scans and connects).

**Acceptance Criteria:**
- `sync/bluetooth/discovery.ts` (or `bluetooth/discovery.ts`) exists
- Host can start advertising with gameType and roomId
- Join can scan for available games
- Join can connect to a host
- Connection is established and devices can identify each other
- Basic error handling (timeout, no devices found, etc.)

**Testing:**
- Use Expo dev build (`npx expo run:ios` or `run:android`—BLE requires native, not Expo Go)
- On Device A: start Host flow (create lobby); confirm advertising starts (may need debug UI or logs)
- On Device B: start Join flow; confirm scan finds Device A's game
- On Device B: tap to join; confirm connection established (devices paired)
- No host available: confirm Join shows "no games found" or timeout

**Files to Create/Modify:**
- `sync/bluetooth/discovery.ts` (or `bluetooth/discovery.ts`)
- `sync/bluetooth/types.ts` (if needed for types)

---

### 8.3 Bluetooth Sync Layer - Message Protocol
**Status:** `not started`  
**Summary:** Implement sending/receiving lobby and game messages over Bluetooth.

**Acceptance Criteria:**
- `sync/bluetooth/messages.ts` exists
- Functions: `sendLobbyMessage(message: LobbyMessage)`, `sendGameMessage(message: GameMessage)`, `onMessageReceived(callback: (message) => void)`
- Messages are serialized/deserialized correctly (JSON)
- Lobby messages work (LOBBY_CREATE, LOBBY_JOIN, LOBBY_LEAVE, LOBBY_START)
- Game messages work (ACTION, FULL_STATE, GAME_OVER)
- Messages are delivered reliably (or errors are handled)

**Testing:**
- With two connected devices, send a LobbyMessage from Host; confirm Join receives it (add temporary log or UI to verify)
- Send GameMessage (e.g. ACTION) from one device; confirm other receives and parses correctly
- Disconnect one device; confirm send/receive handles error (no crash, optional retry or error callback)

**Files to Create/Modify:**
- `sync/bluetooth/messages.ts`
- `sync/bluetooth/types.ts` (if needed)

---

### 8.4 Lobby Screen - Host
**Status:** `not started`  
**Summary:** Create lobby screen for Host (create lobby, see joined players, configure settings, start game).

**Acceptance Criteria:**
- `app/play/[gameId]/lobby/host.tsx` exists
- Screen:
  - Creates lobby and starts advertising
  - Shows list of joined players (host + peers)
  - Shows game settings (if applicable, e.g. Dots grid size)
  - Has "Start" button (enabled when enough players joined)
  - Handles player join/leave events
- Screen navigates to game screen when Start is pressed
- Basic styling

**Testing:**
- Choose "Multi-Player Multiple Devices" → Host; confirm lobby screen appears and advertising starts
- Confirm host appears in player list; when Join device connects, confirm they appear in list
- With 2 players, confirm "Start" is enabled; tap Start; confirm navigates to game screen
- Leave one player; confirm list updates; Start should be disabled if not enough players

**Files to Create/Modify:**
- `app/play/[gameId]/lobby/host.tsx`
- `components/LobbyPlayerList.tsx` (optional)

---

### 8.5 Lobby Screen - Join
**Status:** `not started`  
**Summary:** Create lobby screen for Join (scan for games, join lobby, wait for start).

**Acceptance Criteria:**
- `app/play/[gameId]/lobby/join.tsx` exists
- Screen:
  - Scans for available games
  - Shows list of found games (game type, host name, etc.)
  - Allows joining a game
  - Shows lobby state (waiting for host to start)
  - Handles disconnect/reconnect
- Screen navigates to game screen when host starts
- Basic styling

**Testing:**
- With Host device advertising, choose "Multi-Player Multiple Devices" → Join; confirm scan finds the game
- Tap game to join; confirm Join device shows lobby state and appears in Host's player list
- Host taps Start; confirm Join device automatically navigates to game screen
- Host disconnects; confirm Join shows appropriate UI (disconnected, option to reconnect)

**Files to Create/Modify:**
- `app/play/[gameId]/lobby/join.tsx`

---

### 8.6 Multi-Device Game Screen Integration
**Status:** `not started`  
**Summary:** Update game screen to handle multi-device mode (sync actions, handle remote actions, show connection status).

**Acceptance Criteria:**
- Game screen handles `mode: 'multiDevice'` correctly
- When user makes a move:
  - Action is validated and applied locally
  - Action is sent to other device(s) via Bluetooth
- When remote action is received:
  - Action is applied to local state using same reducer
  - UI updates correctly
- Connection status is shown (connected/disconnected)
- Handles disconnect gracefully (show UI, offer reconnect)
- Game state stays in sync between devices

**Testing:**
- Start multi-device Tic Tac Toe (Host + Join); both devices on game screen
- Make a move on Device A; confirm it appears on both devices
- Make a move on Device B; confirm it appears on both devices
- Play a full game; confirm winner/draw shows on both devices
- Disconnect one device mid-game; confirm connection status shows disconnected and UI handles gracefully

**Files to Create/Modify:**
- `app/play/[gameId]/game.tsx` (or `app/game/[gameId].tsx`)
- `components/ConnectionStatus.tsx` (optional)

---

### 8.7 Update Game Menu for Multi-Device
**Status:** `not started`  
**Summary:** Update game menu to navigate to Host/Join lobby screens for multi-device option.

**Acceptance Criteria:**
- Game menu "Multi-Player Multiple Devices" shows submenu or navigates to Host/Join choice
- User can choose Host or Join
- Navigation works correctly

**Testing:**
- From game menu, tap "Multi-Player Multiple Devices"; confirm Host/Join choice appears (or navigates to choose screen)
- Tap Host; confirm navigates to lobby host screen
- Tap Join; confirm navigates to lobby join (scan) screen

**Files to Create/Modify:**
- `app/play/[gameId]/index.tsx` (or `app/play/[gameId]/menu.tsx`)
- `app/play/[gameId]/lobby/choose.tsx` (optional, if adding Host/Join choice screen)

---

## Phase 9: Additional Games

### 9.1 Dots Game Contract
**Status:** `not started`  
**Summary:** Implement Dots game contract (reducer, validation, queries, AI strategy, metadata).

**Acceptance Criteria:**
- `games/dots/index.ts` exports DotsContract
- Implements all required contract methods
- Reducer handles `{ type: 'DRAW_LINE', edgeKey: string }` actions
- Validation rejects invalid moves
- Queries work correctly
- AI strategy implemented (simple for MVP)
- Extra-turn rule: completing a box gives another turn
- Metadata: name "Dots", paperStyle 'graph'
- Contract is registered in game registry

**Testing:**
- Import DotsContract; call reducer with DRAW_LINE actions; confirm lines appear in state
- Complete a box; confirm extra turn (same player plays again)
- Call getGame('dots'); confirm Dots appears in registry with paperStyle 'graph'

**Files to Create/Modify:**
- `games/dots/index.ts` (and related files if splitting)
- `game-engine/registry.ts` (register the game)

---

### 9.2 Dots Game UI Component
**Status:** `not started`  
**Summary:** Create Dots board UI component that renders dot grid and handles line drawing.

**Acceptance Criteria:**
- `components/games/DotsBoard.tsx` exists
- Renders grid of dots
- Renders lines between dots (based on state)
- Renders boxes with player colors (based on state)
- Handles touch input to draw lines (detects which edge was tapped)
- Board updates when state changes
- Basic styling

**Testing:**
- Start a Dots game (single-player or single-device); confirm dot grid and tap-to-draw work
- Draw lines; confirm they appear; complete a box; confirm it fills with player color
- Confirm extra turn after completing a box

**Files to Create/Modify:**
- `components/games/DotsBoard.tsx`

---

### 9.3 Connect 4 Game Contract
**Status:** `not started`  
**Summary:** Implement Connect 4 game contract (reducer, validation, queries, AI strategy, metadata).

**Acceptance Criteria:**
- `games/connect4/index.ts` exports Connect4Contract
- Implements all required contract methods
- Reducer handles `{ type: 'DROP', col: number }` actions
- Validation rejects invalid moves
- Queries work correctly (including 4-in-a-row detection)
- AI strategy implemented (simple for MVP)
- Metadata: name "Connect 4", paperStyle 'lined'
- Contract is registered in game registry

**Testing:**
- Import Connect4Contract; call reducer with DROP actions; confirm pieces stack in columns
- Play a 4-in-a-row; call getWinner; confirm correct player
- Call getGame('connect4'); confirm Connect 4 in registry

**Files to Create/Modify:**
- `games/connect4/index.ts` (and related files if splitting)
- `game-engine/registry.ts` (register the game)

---

### 9.4 Connect 4 Game UI Component
**Status:** `not started`  
**Summary:** Create Connect 4 board UI component with column buttons to drop pieces.

**Acceptance Criteria:**
- `components/games/Connect4Board.tsx` exists
- Renders 6x7 grid
- Shows column buttons at top (or drag-to-column)
- Renders pieces in columns (colored by player)
- Handles drop action (button press or drag)
- Board updates when state changes
- Basic styling

**Testing:**
- Start Connect 4 game; confirm 6x7 grid and column controls
- Drop pieces in columns; confirm they stack and update
- Play until win; confirm winner detection and game-over state

**Files to Create/Modify:**
- `components/games/Connect4Board.tsx`

---

## Phase 10: Polish & Enhancements

### 10.1 Paper Aesthetic Styling
**Status:** `not started`  
**Summary:** Add paper texture/background styling to game boards (lined, graph, blank based on game).

**Acceptance Criteria:**
- Game boards show paper background/texture
- Style matches game's paperStyle (lined for Tic Tac Toe/Connect 4, graph for Dots)
- Styling is consistent across games
- Looks like paper (texture, color, etc.)

**Testing:**
- Open Tic Tac Toe; confirm lined paper background
- Open Dots; confirm graph paper background
- Open Connect 4; confirm lined paper background
- Visually confirm paper-like look (texture, color) across all three

**Files to Create/Modify:**
- `components/games/TicTacToeBoard.tsx`
- `components/games/DotsBoard.tsx`
- `components/games/Connect4Board.tsx`
- `components/PaperCanvas.tsx` (optional wrapper component)

---

### 10.2 Draw Animation
**Status:** `not started`  
**Summary:** Add animation that "draws" the game board onto paper when game starts.

**Acceptance Criteria:**
- When game screen loads, board animates in (drawing effect)
- Animation duration uses `GAME_DRAW_ANIMATION_MS` constant
- Animation looks like drawing on paper
- Animation can be skipped/fast-forwarded (optional)

**Testing:**
- Start a new game; confirm board draws in with animation (lines appear progressively)
- Confirm duration feels consistent with GAME_DRAW_ANIMATION_MS (~2s default)
- If skip is implemented, tap to skip; confirm animation ends early

**Files to Create/Modify:**
- `components/games/TicTacToeBoard.tsx` (and other game boards)
- `components/GameShell.tsx` (if animation is in shell)

---

### 10.3 Turn Indicator Enhancement
**Status:** `not started`  
**Summary:** Enhance turn indicator to show current/next/previous turn, with long-press to highlight last move.

**Acceptance Criteria:**
- Turn indicator shows current player, next player, previous player
- Long-press on "previous turn" highlights the last move visually
- Highlight is visible and clear
- Works for all games

**Testing:**
- During a game, confirm turn indicator shows current/next/previous
- Long-press "previous turn"; confirm last move is highlighted on the board
- Release; confirm highlight clears
- Repeat for Tic Tac Toe, Dots, Connect 4

**Files to Create/Modify:**
- `components/TurnIndicator.tsx`
- Game board components (to support highlighting last move)

---

### 10.4 Error Handling & Edge Cases
**Status:** `not started`  
**Summary:** Add comprehensive error handling for Bluetooth disconnects, invalid actions, desync, etc.

**Acceptance Criteria:**
- Bluetooth disconnect shows clear UI
- Invalid actions are handled gracefully (logged, ignored, or user notified)
- Desync detection (if implemented) triggers resync or user notification
- App handles background/foreground transitions
- Error states are user-friendly

**Testing:**
- During multi-device game, disconnect one device (turn off Bluetooth or move out of range); confirm clear "disconnected" UI and option to reconnect
- If possible, trigger invalid action (e.g. tamper with message); confirm app doesn't crash and handles gracefully
- Background app during game, then foreground; confirm app still works or shows appropriate state
- Verify error messages are readable (no raw stack traces for users)

**Files to Create/Modify:**
- `sync/bluetooth/messages.ts`
- `app/play/[gameId]/game.tsx`
- `components/ErrorBoundary.tsx` (optional)
- `components/ConnectionStatus.tsx`

---

## Notes

- **Status values:** `complete`, `not started`, `needs design`
- **Order matters:** Complete items in order; later items depend on earlier ones
- **Scope:** Each item should be completable by an AI agent in one session
- **File changes:** If implementation requires modifying files not listed, pause and discuss
- **Testing sections:** Each step includes a **Testing** section describing how a human engineer can manually verify the step was completed correctly
- **End-state matrix:** For the full set of ship-ready test scenarios and their mapping to roadmap steps, see [roadmap-end-state-matrix.md](roadmap-end-state-matrix.md)
