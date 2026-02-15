# Decision: Sync only validated actions (multi-device)

**Status:** Decided  
**Reflected in:** [../architecture.md](../architecture.md) (Game engine, Sync layer), [../datamodels.md](../datamodels.md) (GameMessage, actions)

---

## Context

For multi-device play over Bluetooth we need to keep game state identical on all devices. Two main options:

1. **Sync full state**: After each move, one device (e.g. host) sends the entire game state to others; they replace local state with it.
2. **Sync only actions**: The device where the move happened validates it, applies the reducer, and sends only the **action** (e.g. `{ type: 'PLACE', row: 0, col: 1 }`) to others; every device runs the same reducer so state converges without sending boards or grids.

---

## Decision

We **sync only validated actions**. No routine sync of full game state.

- Only **valid** moves (accepted by the game engine) are sent. Invalid moves never leave the device.
- Recipients apply the **same reducer** to their copy of state with the received action; they do not replace state with a remote payload (except for a rare **resync** after disconnect, if we add it).
- Host can be the authority that broadcasts the canonical action stream; the player whose turn it is produces the action, host (or that player) broadcasts it to all peers.

Full-state sync is reserved for **recovery** only (e.g. reconnect after dropout), not for normal play.

---

## Rationale / consequences

- **Determinism**: Same initial state + same action sequence ⇒ same final state on every device. No “which state wins?” conflicts.
- **Small payloads**: Actions are tiny (e.g. `{ type: 'DROP', col: 3 }`); full state (e.g. 6×7 grid + metadata) is larger and grows with game complexity.
- **Single source of truth**: Game rules live only in the reducer; sync layer stays dumb (deliver actions, optionally request full state on resync).
- **Easier debugging**: Log of actions reproduces the game; desyncs imply either a bug in the reducer or a missing/duplicate action in transport.
- **Tradeoff**: If a device misses an action (e.g. Bluetooth drop), it must get that action or do a one-time full-state resync; we design for that explicitly rather than relying on full-state every turn.

---

## Reflected in

- [../architecture.md](../architecture.md) — §3 Game engine (“Only **validated actions** are sent…”), §4 Sync layer (“In-game: Only **actions**…”), §6 Data flow (“Sync layer sends action…”).
- [../datamodels.md](../datamodels.md) — `GameMessage` with `ACTION` and optional `FULL_STATE` for resync; per-game action types.
