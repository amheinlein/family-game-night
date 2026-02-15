# Implementation Readiness Review

This document assesses whether we have enough detail to begin implementation and identifies gaps or decisions that should be resolved first.

---

## ✅ What we have (well-defined)

### Architecture & Structure
- ✅ High-level component architecture (UI, Game Shell, Engine, Sync, Settings)
- ✅ Navigation structure (Expo Router routes)
- ✅ Folder structure (app/, components/, game-engine/, games/, sync/, settings/, constants/)
- ✅ Data flow (single-player, single-device, multi-device)

### Data Models
- ✅ Core types: Player, GameSession, Lobby, UserSettings
- ✅ Per-game state shapes: TicTacToeState, DotsState, Connect4State
- ✅ Action types for each game
- ✅ Sync message types (LobbyMessage, GameMessage)

### Design Decisions
- ✅ Sync approach (validated actions only)
- ✅ Stack choices (React Native, Expo, Expo Router, Context + useReducer)
- ✅ Bluetooth approach (BLE, Host=peripheral, Join=central)
- ✅ Settings structure (difficulty, displayName, myColor, opponent1Color)
- ✅ Paper style (per-game config, not user setting)

---

## ⚠️ Gaps & Open Questions

### 1. Game Contract Interface (HIGH PRIORITY)

**Status:** Mentioned but not formally defined

**What's missing:**
- Concrete TypeScript interface/type that each game must implement
- Exact function signatures for:
  - Reducer: `(state: GameState, action: GameAction) => GameState`
  - Validation: `(state: GameState, action: GameAction) => boolean`
  - Queries: `getCurrentTurnPlayerIndex(state)`, `getWinner(state)`, `isDraw(state)`, `getLastMove(state)`
  - AI strategy: `(state: GameState, difficulty: number) => GameAction | null`
  - Game metadata: `{ name: string, image: string, description?: string, paperStyle: 'lined' | 'graph' | 'blank' }`

**Recommendation:** Create `docs/game-contract.md` with the exact interface/type definitions that all games must implement. This is critical for implementation.

---

### 2. AI Strategy Details (MEDIUM PRIORITY)

**Status:** Mentioned but not detailed

**What's missing:**
- How difficulty maps to strategy (1-10 numeric vs Easy/Medium/Hard enum?)
- Whether difficulty is global or per-game (architecture says "as you prefer" — needs decision)
- How AI actions are scheduled/dispatched (immediate? debounced? in a useEffect?)
- What happens if AI can't find a valid move (shouldn't happen, but error handling?)

**Recommendation:** 
- Decide: difficulty as `1 | 2 | 3 | ... | 10` (numeric) or `'easy' | 'medium' | 'hard'` (enum)
- Decide: global difficulty or per-game? (Recommendation: global for MVP, per-game later if needed)
- Document: AI scheduler pattern (e.g. useEffect that watches `currentTurnIndex` and `players[currentTurnIndex].id === 'AI'`)

---

### 3. Bluetooth Implementation Details (MEDIUM PRIORITY)

**Status:** Approach decided, specifics TBD

**What's missing:**
- Exact library choice (we said "evaluate react-native-ble-phone-to-phone first")
- Service UUIDs and characteristic UUIDs for BLE
- Message serialization format (JSON? MessagePack? Plain strings?)
- Device identification: how do we name/identify devices? (device name? custom identifier?)
- Connection lifecycle: when to disconnect? Reconnect behavior? Timeouts?
- How to handle "device already connected" scenarios

**Recommendation:**
- Create `docs/decisions/bluetooth-implementation.md` after evaluating libraries
- Document chosen UUIDs, serialization format, device naming strategy
- Define connection lifecycle (e.g. disconnect on app background? on game end? manual?)

---

### 4. Error Handling & Edge Cases (MEDIUM PRIORITY)

**Status:** Some risks identified, but not detailed

**What's missing:**
- **Bluetooth disconnect mid-game:** What happens? Show "disconnected" UI? Auto-reconnect? Offer "resume" vs "restart"?
- **Invalid action received over sync:** Log and ignore? Request resync? Alert user?
- **Desync detected:** How? (State hash? Sequence number?) What action? (Full-state sync? Alert user? Reset game?)
- **Device goes to sleep/background:** Pause game? Disconnect? Keep connection alive?
- **Multiple games/lobbies:** Can a device host multiple lobbies? Join multiple? (Probably no for MVP, but document)

**Recommendation:** Add an "Error handling & edge cases" section to architecture.md or create `docs/error-handling.md`.

---

### 5. Game-Specific Rules & Config (LOW-MEDIUM PRIORITY)

**Status:** Some ambiguity

**What's missing:**
- **Dots game:** Extra turn when completing a box? (Mentioned in datamodels but not decided)
- **Tic Tac Toe:** Always 3x3? Or configurable? (Assume 3x3 for MVP)
- **Connect 4:** Always 6x7? Or configurable? (Assume 6x7 for MVP)
- **Dots:** Default grid size? (e.g. 5x5? 6x6?)
- **Game settings:** Which games have configurable settings? (Dots grid size? Connect 4 size? Tic Tac Toe probably none)

**Recommendation:** 
- Document MVP defaults: Tic Tac Toe 3x3, Connect 4 6x7, Dots 5x5 (or 6x6)
- Decide: Dots extra-turn rule (Recommendation: yes, extra turn on box completion)
- Document: which games expose settings in lobby (probably Dots grid size; others fixed for MVP)

---

### 6. UI/UX Implementation Details (LOW PRIORITY - can decide during implementation)

**Status:** High-level described, specifics TBD

**What's missing:**
- **Drawing animation:** How? (SVG path animation? Canvas drawing? React Native Animated API?)
- **Paper texture:** How to render? (Background image? CSS/texture? SVG pattern?)
- **Touch/drag handling:** Specifics for each game (e.g. Dots: how to detect which edge was tapped?)
- **Connect 4 drop:** Buttons vs drag-to-column? (Architecture says "buttons or drag" — decide during implementation)
- **Turn indicator UI:** Exact design? (Text? Icons? Colors?)
- **"Highlight previous move":** How? (Pulse? Border? Overlay?)

**Recommendation:** These can be decided during implementation, but consider creating `docs/ui-patterns.md` to document choices as you make them.

---

### 7. Player Identification & "Me" vs "Opponent" (MEDIUM PRIORITY)

**Status:** Partially defined

**What's missing:**
- **Single-player mode:** Who is "me"? (The human player, always player[0])
- **Single-device multiplayer:** Who is "me"? (The person whose turn it is? Or always player[0]?)
- **Multi-device:** How does a device know which player is "me"? (Match `Player.id` to `DeviceId`? Or use `order`? Or compare `displayName` to `UserSettings.displayName`?)
- **AI player:** How is it identified? (`Player.id === 'AI'`? Special constant?)

**Recommendation:** Document in `datamodels.md`:
- Single-player: `players[0]` is human (me), `players[1]` is AI
- Single-device: No "me" concept; use generic labels "Player 1", "Player 2"
- Multi-device: Match `Player.id` to this device's `DeviceId` (or use a "this device's player ID" stored at session start)
- AI: `Player.id === 'AI'` constant

---

### 8. Constants & Config Values (LOW PRIORITY)

**Status:** Mentioned but not enumerated

**What's missing:**
- Draw animation duration (default value? e.g. 2000ms?)
- Crayola 8 colors (exact hex codes)
- Default difficulty (if not set)
- Default display name (if not set)
- Default colors (if not set)

**Recommendation:** Create `docs/constants.md` or add to `constants.ts` with all dev-facing constants and their default values.

---

## 📋 Recommended Pre-Implementation Checklist

Before starting implementation, resolve:

1. ✅ **Game contract interface** — Create formal TypeScript interface (HIGH)
2. ✅ **Player identification** — Document how "me" vs "opponent" is determined (MEDIUM)
3. ✅ **AI strategy details** — Decide difficulty format, scheduling pattern (MEDIUM)
4. ✅ **Game-specific rules** — Document MVP defaults and extra-turn rules (MEDIUM)
5. ⚠️ **Bluetooth library choice** — Evaluate and document chosen library + UUIDs (can start with mock/single-device first) (MEDIUM)
6. ⚠️ **Error handling** — Document disconnect/resync behavior (can iterate) (MEDIUM)

**Can defer to implementation:**
- UI/UX specifics (drawing animation, paper texture, touch handling)
- Exact constants values (can set defaults and tune)
- Some edge cases (can handle as they come up)

---

## 🎯 Recommendation

**You have enough detail to start implementation** for:
- ✅ Single-player mode (no Bluetooth needed)
- ✅ Single-device multiplayer (no Bluetooth needed)
- ✅ Game engine (reducer, validation, queries)
- ✅ UI structure (screens, navigation, basic components)
- ✅ Settings (persistence, UI)

**Resolve these before multi-device:**
- Game contract interface (needed for all games)
- Player identification logic (needed for color mapping)
- Bluetooth library choice + UUIDs (needed for sync layer)

**Can iterate on:**
- Error handling (add as you encounter edge cases)
- UI polish (drawing animation, paper texture)
- Constants tuning (draw duration, etc.)

---

## Next Steps

1. Create `docs/game-contract.md` with the formal interface
2. Document player identification logic in `datamodels.md`
3. Decide and document AI difficulty format and scheduling
4. Start implementation with single-player Tic Tac Toe (no Bluetooth, validates the game contract)
5. Evaluate Bluetooth libraries and document choice before implementing multi-device
