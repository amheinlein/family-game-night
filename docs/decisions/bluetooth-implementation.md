# Decision: Bluetooth implementation

**Status:** Decided  
**Related:** [bluetooth-sync.md](bluetooth-sync.md), [sync-validated-actions.md](sync-validated-actions.md)

---

## Context

Multi-device play requires BLE with Host = peripheral (advertise) and Join = central (scan/connect). We need a concrete library choice, UUIDs, and message format.

---

## Decision

- **Library:** Use **react-native-ble-plx** (central) + **react-native-ble-peripheral** (peripheral) for MVP, as the fallback in [bluetooth-sync.md](bluetooth-sync.md). Re-evaluate **react-native-ble-phone-to-phone** or similar when adding full multi-device (Expo dev build required; not Expo Go).
- **BLE service UUID:** `0000xxxx-0000-1000-8000-00805f9b34fb` (to be set in code; e.g. a custom 16-bit base).
- **Characteristic UUID:** One characteristic for JSON messages (write/notify).
- **Message format:** JSON. Lobby: `LobbyMessage`; in-game: `GameMessage` (see [datamodels.md](../datamodels.md)). Serialize with `JSON.stringify`, parse with `JSON.parse`; validate shape on receive.
- **Device identification:** Host advertises with a payload containing `roomId` and `gameType`. Join scans and shows list of games; on connect, devices exchange `DeviceId` (e.g. UUID from device or generated at first run).
- **Connection lifecycle:** Host starts advertising when lobby is created; stops when game starts or lobby is closed. Join disconnects on leave or when host closes. On unexpected disconnect, show "Disconnected" UI and offer "Reconnect" or "Leave". No automatic reconnect in MVP.

---

## Reflected in

- `sync/bluetooth/discovery.ts` (when implemented)
- `sync/bluetooth/messages.ts` (when implemented)
- [bluetooth-sync.md](bluetooth-sync.md)
