# Stack options — items to decide

This document lists stack-related choices that were open in [preferredstack.md](preferredstack.md), with **alternatives** and **recommendations**. The actual decisions are recorded in the linked decision docs; this file is the options analysis so we (and AI) can see how we got to each recommendation.

---

## 1. State management

**Needs to address:** Where session + game state live, how the UI dispatches actions into the game engine reducer, and how we avoid duplicating game state between a state library and the reducer.

| Option | Pros | Cons |
|--------|------|------|
| **React Context + useReducer** | No extra dependency; reducer is the single source of truth; fits our “game engine = reducer” design; easy to test. | All consumers of context re-render when state changes unless we split context or use selectors; need to pass dispatch down or via one context. |
| **Zustand** | Small bundle; no Provider; good for “store + dispatch”; can hold session and call game reducer inside a store action. | Adds a dependency; we must avoid putting raw game state in Zustand and instead keep “session + current state” and dispatch into the same reducer we use for sync. |
| **Redux Toolkit** | Explicit actions, middleware, devtools; fits reducer-centric design. | Heavier API and bundle; more boilerplate for a small app; likely overkill for our scope. |

**Recommendation:** **React Context + useReducer.** The game engine is already reducer-based; the shell can hold `GameSession` (including `state`) in React state and dispatch actions through the same reducer. No duplication, no extra lib, and sync layer can reuse the same reducer when it receives remote actions. If we later need store outside the React tree (e.g. for background sync), we can introduce a small store that wraps the same reducer.

**Decision recorded in:** [state-management.md](state-management.md)

---

## 2. Bluetooth / multi-device sync

**Needs to address:** How two (or more) devices discover each other and exchange lobby + action messages offline. Must support Host (advertise / accept join) and Join (discover / connect).

**Constraint:** Phone-to-phone requires one device to act as **peripheral** (advertises a service) and the other(s) as **central** (scan and connect). So Host = peripheral, Join = central.

| Option | Pros | Cons |
|--------|------|------|
| **react-native-ble-plx** | Popular, well-maintained, works with Expo (config plugin / dev build). | **Central-only** — no peripheral mode, so it cannot act as Host by itself. We’d need a second library for peripheral (e.g. react-native-multi-ble-peripheral) and coordinate roles. |
| **react-native-ble-manager** | Central mode, has Expo example. | Documented API is central-focused; peripheral support is unclear or in a separate package. |
| **react-native-multi-ble-peripheral** | Purpose-built for BLE peripheral (advertiser) on React Native. | Only peripheral; we’d pair it with a central library (e.g. react-native-ble-plx) so Host uses one, Join uses the other — two libs and role-based setup. |
| **react-native-ble-phone-to-phone** | Designed for simple phone-to-phone: one device advertises, one scans. | Less widely used; need to verify Expo compatibility and maintenance. |
| **Bluetooth Classic (e.g. react-native-bluetooth-classic)** | Serial-style connection, can be reliable. | Different API and model; some packages have outdated deps; not BLE so we’d document a separate path. |

**Recommendation:** **BLE with Host = peripheral, Join = central.** Use a single approach that supports both roles (one lib or a thin wrapper). **First evaluate:** a purpose-built phone-to-phone solution (e.g. **react-native-ble-phone-to-phone**) so we get one abstraction for “advertise” and “scan/connect.” **Fallback:** **react-native-ble-plx** (Join/central) + **react-native-multi-ble-peripheral** (Host/peripheral), with a small sync layer that switches behavior by role. Document the chosen library and any Expo (dev build / config plugin) requirements in the decision doc.

**Decision recorded in:** [bluetooth-sync.md](bluetooth-sync.md)

---

## 3. Already decided (no open alternatives)

- **Runtime & navigation:** React Native, Expo, Expo Router.
- **Local persistence:** Expo AsyncStorage (or SecureStore for sensitive prefs).
- **Game logic:** Pure TypeScript/JavaScript; reducers in `game-engine/` and `games/`.

These are fixed in [preferredstack.md](preferredstack.md) and do not need alternatives here.
