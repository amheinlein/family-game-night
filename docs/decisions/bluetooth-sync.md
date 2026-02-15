# Decision: Bluetooth / multi-device sync library and approach

**Status:** Decided  
**Reflected in:** [../architecture.md](../architecture.md) (Sync layer §4), [preferredstack.md](preferredstack.md)  
**Options analysis:** [stack-options.md](stack-options.md#2-bluetooth--multi-device-sync)

---

## Context

Multi-device play requires two (or more) phones to discover each other and exchange small JSON messages (lobby + actions) over a local link, without internet. BLE is the natural fit; phone-to-phone requires one device to **advertise** (peripheral) and the other(s) to **scan and connect** (central). So Host = peripheral, Join = central.

---

## Decision

- **Approach:** Use **BLE** with **Host = peripheral** (advertise a game lobby) and **Join = central** (scan for lobbies, connect, then exchange messages). Message protocol remains as in [../datamodels.md](../datamodels.md) (lobby messages + action-only in-game).
- **Library strategy:** Prefer a **single** library or thin wrapper that supports both peripheral and central. **First evaluate:** **react-native-ble-phone-to-phone** (or similar purpose-built phone-to-phone BLE) for one abstraction. **Fallback:** Use **react-native-ble-plx** for central (Join) and **react-native-multi-ble-peripheral** for peripheral (Host), with a sync layer that switches behavior by role. Exact package names and Expo compatibility (e.g. dev build, config plugin) to be confirmed at implementation time and recorded in this doc or in code comments.
- **Expo:** BLE requires native code; use Expo dev builds (or custom dev client), not Expo Go, for multi-device. Document this in README or setup docs.

---

## Rationale / consequences

- BLE is standard, works on iOS and Android, and fits small JSON payloads (lobby + actions).
- Host-as-peripheral and Join-as-central matches “one device creates a game, others find and join it.”
- Evaluating a purpose-built phone-to-phone lib first keeps the sync layer simple; fallback to plx + multi-ble-peripheral gives a known path if the first option doesn’t meet Expo or maintenance needs.
- Resync and reliability (acks, full-state on reconnect) are still as in [sync-validated-actions.md](sync-validated-actions.md) and the architecture.

---

## Reflected in

- [../architecture.md](../architecture.md) — Sync layer (§4): roles (Host/Peer), discovery, message protocol.
- [preferredstack.md](preferredstack.md) — Bluetooth / sync row updated to this decision.
