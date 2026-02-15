# Decision: Preferred stack

**Status:** Decided  
**Reflected in:** [../architecture.md](../architecture.md) (UI layer, folder structure), project [README](../../README.md)

---

## Context

We need a consistent set of frameworks and libraries for the app: runtime, navigation, state, Bluetooth, and local persistence. The product vision (offline, React Native, Expo, multi-platform, touch/drag input) constrains some choices; others are open.

---

## Decision

- **Runtime & UI:** React Native with **Expo** for multi-platform (iOS, Android, web if desired).
- **Navigation:** **Expo Router** for file-based routing and native navigation.
- **Input:** Support touch, drag, long-press (and hover where the platform supports it); keep input handling in a thin layer so game logic stays input-agnostic.
- **State management:** **React Context + useReducer.** The game shell holds session and game state in React state and dispatches through the same reducer the game engine defines; sync layer dispatches remote actions to the same reducer. See [state-management.md](state-management.md).
- **Bluetooth / sync:** **BLE with Host = peripheral, Join = central.** Prefer a single library that supports both roles (e.g. react-native-ble-phone-to-phone); fallback: react-native-ble-plx (central) + react-native-multi-ble-peripheral (peripheral). Requires Expo dev build (not Expo Go). See [bluetooth-sync.md](bluetooth-sync.md).
- **Local persistence:** Use **Expo**-provided APIs (e.g. AsyncStorage or SecureStore) for settings and local player preferences; avoid introducing a separate DB until needed.
- **Game logic:** Pure TypeScript/JavaScript; no framework lock-in. Reducers and game contracts live in `game-engine/` and `games/` and are testable without React or Bluetooth.

---

## Rationale / consequences

- **Expo + Expo Router** matches the README and gives a single toolchain, OTA potential, and a clear place for native modules (e.g. Bluetooth) when we add them.
- **State and Bluetooth** are decided in separate records ([state-management.md](state-management.md), [bluetooth-sync.md](bluetooth-sync.md)); options and rationale are in [stack-options.md](stack-options.md).
- **Pure game engine** keeps sync and UI simple: one reducer per game, same code path for single-player, pass-and-play, and multi-device.

---

## Reflected in

- [../architecture.md](../architecture.md) — UI layer (Expo, Expo Router), folder structure (`app/`, `game-engine/`, `games/`, `sync/`, etc.), local preferences (AsyncStorage/SecureStore).
- [../../README.md](../../README.md) — React Native, Expo, Expo Router, input requirements.
