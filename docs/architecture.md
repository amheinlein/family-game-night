# Family Game Night — Architecture

This document outlines the high-level architecture to support local, offline, Bluetooth-capable family games with a paper aesthetic and flexible play modes (single-player, pass-and-play, multi-device).

---

## Design principles

- **Offline-first**: No internet; all logic and sync over local Bluetooth (and in-app state for single device).
- **Modular games**: Each game plugs into a common game contract (state shape, actions, validation, optional AI).
- **Single source of truth**: Game rules and state transitions live in one place; UI and sync layers consume that state.
- **Local customization**: Player names and colors are per-device preferences; only canonical player IDs and turn order are synced.

---

## Design decisions

The following decisions are binding for implementation. Rationale and context are in the [decision log](decisions/README.md); when touching code that depends on one of these, review the linked document.

| Decision | Where it applies | Decision doc |
|----------|------------------|--------------|
| **Sync only validated actions** — Multi-device sync sends actions only; all devices run the same reducer. Full-state sync is for resync/recovery only. | Game engine (§3), Sync layer (§4), Data flow (§6) | [sync-validated-actions.md](decisions/sync-validated-actions.md) |
| **Preferred stack** — React Native, Expo, Expo Router; pure game engine; Expo storage for settings; state = Context + useReducer; Bluetooth = BLE host/peripheral, join/central. | UI layer (§1), Folder structure (§7), Local preferences (§5) | [preferredstack.md](decisions/preferredstack.md) |
| **State management** — React Context + useReducer; game shell holds session; same reducer for UI and sync. | Game shell (§2), Game engine (§3), Data flow (§6) | [state-management.md](decisions/state-management.md) |
| **Bluetooth / sync** — BLE; Host = peripheral, Join = central; prefer single lib (e.g. phone-to-phone), fallback plx + multi-ble-peripheral. | Sync layer (§4) | [bluetooth-sync.md](decisions/bluetooth-sync.md) |

*(New decisions are added here and in `docs/decisions/` with a short summary and link.)*

---

## Component overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  UI Layer (React Native + Expo Router)                                   │
│  Screens, shared components, paper canvas, player/turn indicators       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Game Shell / Session Orchestration                                      │
│  Mode (single / singleDevice / multiDevice), lobby, start/end game      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌───────────────────────┐ ┌───────────────┐ ┌─────────────────────────────┐
│  Game Engine (Core)    │ │  Sync Layer   │ │  Local Preferences           │
│  Per-game state +      │ │  Bluetooth    │ │  Difficulty, display name,    │
│  actions, validation,  │ │  Host/Peer    │ │  my color / opponent color   │
│  AI strategies         │ │  Message protocol                              │
└───────────────────────┘ └───────────────┘ └─────────────────────────────┘
```

---

## 1. UI layer

- **Navigation**: [Expo Router](decisions/preferredstack.md) (see Preferred stack)  
  - `/(tabs)/` or `/` → Home (Play, Settings)  
  - `/play` → Game grid (tiles: image + name)  
  - `/play/[gameId]` → Game menu (Single Player, Multi-Player 1 device, Multi-Player multiple devices)  
  - `/play/[gameId]/game` → Active game screen  
  - `/settings` → Difficulty, display name, color preferences (My color, Opponent 1 color for MVP).

- **Shared game UI** (see README):  
  - Top left: player list; tap to change **local** color or see display name (same component as in Settings, with generic labels like “Player 1” / “Player 2” or “You” / “Opponent”).  
  - Center: game title.  
  - Top right: current / next / previous turn; long-press previous to highlight last move.  
  - Main area: “paper” canvas; style (lined / graph / blank) is **defined by the game**, not a user setting.  
  - Optional: “drawing” animation when the board appears; duration is set in code (see below), not by the user.

- **Input**: Touch, drag, long-press (and hover if needed on supported devices). Game shell dispatches high-level actions (e.g. “cell clicked”, “line drawn”) to the game engine; no game logic in UI.

---

## 2. Game shell / session orchestration

- **Responsibilities**:  
  - Choose mode: single-player (vs AI), single-device multiplayer (pass-and-play), multi-device (Bluetooth).  
  - For multi-device: Host (create lobby, settings, list of joined players, Start) vs Join (discover and join lobby).  
  - Create a **game session** with the right number of players and inject it into the game engine.  
  - Wire turn changes and game-over from engine to UI (and to sync layer in multi-device).

- **Session lifecycle**:  
  - Lobby (multi-device only) → Start → In progress → Game over (winner/draw) → optional “play again” or exit.

---

## 3. Game engine (core)

- **Contract** (implemented per game, e.g. Tic Tac Toe, Dots, Connect 4):  
  - **State**: One serializable state object per game type (see `datamodels.md`).  
  - **Actions**: Typed actions (e.g. `{ type: 'PLACE', cell: [row, col] }`).  
  - **Reducer**: `(state, action) => state` — pure, deterministic.  
  - **Validation**: Reject invalid moves; only valid moves produce new state.  
  - **Queries**: `getCurrentTurnPlayerIndex()`, `getWinner()`, `isDraw()`, `getLastMove()` (for “highlight previous move”).

- **Single-player**:  
  - Same reducer; when it’s the AI’s turn, a **strategy** function (per difficulty) chooses an action and dispatches it.  
  - Difficulty (e.g. 1–10 or Easy/Medium/Hard) is read from settings; each game implements its own strategy per level.

- **Multi-device**:  
  - Only **validated actions** are sent over the sync layer; recipients apply the same reducer so state stays identical. Host can be the authority that broadcasts the canonical action stream. See [Sync only validated actions](decisions/sync-validated-actions.md).

---

## 4. Sync layer (Bluetooth, multi-device only)

- **Roles**: Host (creates lobby, holds game settings, can Start game); Peers (join via discovery).  
- **Discovery**: Join flow discovers “games in Host state accepting players” (e.g. service name or payload with game type + room id).  
- **Protocol**:  
  - **Lobby**: Join/Leave, list of players (ids + display names), host-driven settings, Start command.  
  - **In-game**: Only **actions** (and maybe a rare full-state sync for resync/recovery). Each device runs the same reducer so state converges. See [Sync only validated actions](decisions/sync-validated-actions.md).  
- **Reliability**: Consider acks/retries for critical messages; optional checksum or sequence number to detect desync and trigger full-state sync.  
- **Scale**: MVP can target 2 devices; design messages so that adding more players (e.g. 4–8) is a matter of more peers and larger player lists, not a protocol change.

---

## 5. Local preferences / settings

- Stored only on device (Expo AsyncStorage or SecureStore; see [Preferred stack](decisions/preferredstack.md)):
  - **Difficulty** (global or per-game, as you prefer).
  - **Display name** — the name this device’s user prefers to show (e.g. in lobbies and in-game). No validation required; duplicate names across players are OK.
  - **Color preferences** — for MVP: **My color** and **Opponent 1 color** (Crayola 8). This device uses these to render “me” and “opponent” in-game; not synced, so each device can show different colors for the same logical player.
- **Paper style** is **not** a user setting. Each **game** defines its own paper style (lined / graph / blank) in game config; the canvas uses that for the main area.
- Use a **single shared UI component** for choosing display name and color: the same component appears in **Settings** (with labels like “My color”, “Opponent 1 color”, “Display name”) and **in-game** (with generic labels like “Player 1”, “Player 2” or “You”, “Opponent”). Only the labels differ; behavior and persistence are shared.

**Draw animation duration** (the time for the “drawing the game onto paper” animation when a new game begins) is **not** a user setting. Define it in a **constants or game-config file** in code (e.g. `GAME_DRAW_ANIMATION_MS` or similar) so it’s easy to find and change during development and testing.

---

## 6. Data flow summary

- **Single-player / single-device**:  
  - User or AI triggers an action → Game engine reducer → new state → UI (and optional persistence for “resume game”).  

- **Multi-device**:  
  - User triggers an action → Game engine validates and reduces locally → Sync layer sends action to other device(s) → Others run same reducer → Same state everywhere.  
  - Host can send “Start game” with initial state or seed; from then on only actions are sent.

---

## 7. Suggested folder structure (conceptual)

- `app/` — Expo Router screens.  
- `components/` — Shared UI (player strip, turn indicator, paper canvas wrapper).  
- `game-engine/` — Generic game contract (types, reducer runner, AI scheduler).  
- `games/` — One folder per game (e.g. `tic-tac-toe`, `dots`, `connect4`) with state type, reducer, validation, strategies.  
- `sync/` or `bluetooth/` — Discovery, host/peer roles, message protocol, action broadcast.  
- `settings/` or `store/` — Reading/writing difficulty, display name, color preferences (my color, opponent1 color). Shared component for color/name selection used in Settings and in-game.
- `constants.ts` or `config/` — Dev-facing values such as draw animation duration (not user-configurable).  

This keeps game logic, sync, and UI clearly separated and makes adding new games and tuning AI/sync easier.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Bluetooth reliability / dropouts | Design for “reconnect and resync”; optional full-state sync; clear UI when disconnected. |
| Desync between devices | Only sync actions; same reducer everywhere; optional periodic state hash check. |
| Cross-platform input (touch vs hover) | Abstract “pointer” events in the game shell so each game receives unified events. |
| Connect 4 “drop” interaction | Use column buttons or drag-to-column; keep action as “column index”; state stays simple. |

---

*This architecture is intended to support the README’s core vision: offline, modular, 1-device or multi-device, with a paper look and local player customization.*
