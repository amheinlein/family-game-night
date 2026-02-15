# Decision: State management

**Status:** Decided  
**Reflected in:** [../architecture.md](../architecture.md) (Game shell, Game engine), [preferredstack.md](preferredstack.md)  
**Options analysis:** [stack-options.md](stack-options.md#1-state-management)

---

## Context

We need a single place for game session and game state that (1) drives the UI, (2) dispatches user and AI actions through the same game reducer, and (3) can be updated from the sync layer when remote actions arrive — without duplicating state between a state library and the reducer.

---

## Decision

Use **React Context + useReducer** for session and game state in the game shell.

- The shell holds **one** `GameSession` (including `state`) in React state via `useReducer`, using the **same** reducer the game engine defines for that game type.
- UI and AI dispatch actions to this reducer; the sync layer, when it receives a remote action, also dispatches to the same reducer so state stays identical across devices.
- No separate “state library” for game state; the reducer is the single source of truth. Optional: a small context that exposes `{ session, dispatch }` (or `session` + an action dispatcher) so screens and components can read and send actions without prop drilling.
- If we later need state outside the React tree (e.g. background or worker), we can introduce a minimal store that wraps the same reducer and injects updates back into React (e.g. via a subscription or context update).

---

## Rationale / consequences

- **No duplication:** Game state exists only in the reducer state; sync and UI both go through the same reducer.
- **No extra dependency:** Keeps the stack minimal and aligns with our “pure game engine” choice.
- **Testability:** Reducer and actions can be unit-tested without any React or provider setup.
- **Tradeoff:** Components that subscribe to the whole context re-render when any part of session changes; we can mitigate with multiple contexts (e.g. “session metadata” vs “game state”) or by keeping the context value stable and having components depend only on what they need, if it becomes a performance issue.

---

## Reflected in

- [../architecture.md](../architecture.md) — Game shell holds session and wires dispatch to engine and sync; data flow (§6).
- [preferredstack.md](preferredstack.md) — State management row updated to this decision.
