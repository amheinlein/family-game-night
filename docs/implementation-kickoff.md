# Implementation Kickoff

**Your prompt (use this every time):**

> Review docs/implementation-kickoff.md and proceed with the next step.

The agent reads this doc, finds the **next step** from the progress table below, implements that step per the [Implementation Roadmap](roadmap.md), verifies it per the roadmap's Testing section, then **updates this doc** by marking that step complete and reports back.

**Related:** [Implementation Roadmap](roadmap.md) | [End-State Test Matrix](roadmap-end-state-matrix.md) | [AGENTS.md](../AGENTS.md)

---

## Current progress

**Next step:** Find the first row below with status `pending` — that is the step to implement. When done, change its status to `complete` and save this file.

| Step | Summary | Status |
|------|---------|--------|
| 1.1 | Project Setup (Expo, TypeScript, Router, folder structure) | complete |
| 1.2 | Core Type Definitions (datamodels → game-engine/types) | pending |
| 1.3 | Constants File (GAME_DRAW_ANIMATION_MS, CRAYOLA_8, defaults) | pending |
| 1.4 | Game Contract Interface (contract.ts, GameContract) | pending |
| 2.1 | Settings Persistence Layer (loadSettings/saveSettings) | pending |
| 2.2 | Settings Screen UI (difficulty, display name, colors) | pending |
| 3.1 | Home Screen (Play + Settings buttons) | pending |
| 3.2 | Play Screen - Game Grid (placeholder tiles) | pending |
| 4.1 | Game Engine Core (runner: dispatchAction, getCurrentTurn, etc.) | pending |
| 4.2 | Game Registry (registerGame, getGame) | pending |
| 5.1 | Tic Tac Toe Game Contract (reducer, validation, AI, metadata) | pending |
| 5.2 | Tic Tac Toe UI Component (3×3 board) | pending |
| 5.3 | Game Screen Shell (session, turn indicator, AI turns) | pending |
| 5.4 | Game Menu Screen (Single / 1 device / Multi-device) | pending |
| 5.5 | Update Play Screen to Show Games (from registry) | pending |
| 6.1 | Pass-and-Play Mode Support | pending |
| 7.1 | Player Color Mapping Logic | pending |
| 7.2 | Player Display Name Logic | pending |
| 7.3 | Player Strip Component (Settings + in-game) | pending |
| 8.1 | Bluetooth Library Evaluation & Decision | pending |
| 8.2 | Bluetooth Sync Layer - Discovery | pending |
| 8.3 | Bluetooth Sync Layer - Message Protocol | pending |
| 8.4 | Lobby Screen - Host | pending |
| 8.5 | Lobby Screen - Join | pending |
| 8.6 | Multi-Device Game Screen Integration | pending |
| 8.7 | Update Game Menu for Multi-Device | pending |
| 9.1 | Dots Game Contract | pending |
| 9.2 | Dots Game UI Component | pending |
| 9.3 | Connect 4 Game Contract | pending |
| 9.4 | Connect 4 Game UI Component | pending |
| 10.1 | Paper Aesthetic Styling | pending |
| 10.2 | Draw Animation | pending |
| 10.3 | Turn Indicator Enhancement | pending |
| 10.4 | Error Handling & Edge Cases | pending |

---

## What to do when you run

1. **Read [AGENTS.md](../AGENTS.md).** Before changing code that touches sync, state, Bluetooth, or game flow, read the linked decision docs and architecture as specified there.

2. **Find the next step.** In the **Current progress** table above, the first step with status `pending` is the one to do. Open [roadmap.md](roadmap.md) and locate that step (e.g. "### 1.1 Project Setup") for full Acceptance Criteria, Testing, and Files to Create/Modify.

3. **Implement only that step.** Fulfill the Acceptance Criteria. Create or modify **only** the files listed for that step. If you need to change other files, pause and ask.

4. **Verify.** Run the checks in that step's **Testing** section (manual or automated). Confirm the step is done before moving on.

5. **Update this doc.** In the **Current progress** table, change that step's Status from `pending` to `complete`. Save docs/implementation-kickoff.md.

6. **Report back.** Say which step you completed and that the next step is &lt;next pending step&gt;. Optionally list which end-state tests (see [roadmap-end-state-matrix.md](roadmap-end-state-matrix.md)) are now passable.

**One step per run.** Do not implement the next step in the same session unless the user explicitly asks you to continue (e.g. "proceed with the next two steps").

---

## Optional: milestone targets (Option C)

When you want the agent to drive toward a **specific end-state** instead of strict one-step-at-a-time, use one of the prompts below. The agent will work through the required roadmap steps in order until the target test(s) pass, and should update the **Current progress** table for each step completed.

| Prompt | Target | Key steps |
|--------|--------|-----------|
| **C1** | Foundation: E01–E05 | 1.1 → 1.2 → 1.3 → 1.4 |
| **C2** | Tic Tac Toe single-player: E14 | 1.1–5.5 |
| **C3** | Pass-and-play: E16 | E14 + 6.1 |
| **C4** | Multi-device Tic Tac Toe: E23 | 1.1–5.5, 8.1–8.6 |
| **C5** | Dots: E26, E27, E28 | 9.1, 9.2, 10.1 |
| **C6** | Connect 4: E29, E30, E31 | 9.3, 9.4, 10.1 |
| **C7** | Polish: E32–E35 | 10.1–10.4 |
| **C8** | Settings & player identity: E06–E08, E17–E19 | 2.1, 2.2, 7.1, 7.2, 7.3 |

**C1 — Foundation**

```
Review docs/implementation-kickoff.md. Your goal is to get Phase 1 complete: end-state tests E01–E05 passing. Use docs/roadmap-end-state-matrix.md Section 2 for E01–E05. Implement roadmap steps 1.1 → 1.2 → 1.3 → 1.4 in order from docs/roadmap.md. Verify each step's Testing section. Update the Current progress table in docs/implementation-kickoff.md for each step you complete. When E01–E05 are passable, report back. Do not start Phase 2 until we say so.
```

**C2 — Tic Tac Toe single-player**

```
Review docs/implementation-kickoff.md. Your goal is end-state test E14 (Single-player Tic Tac Toe). Use docs/roadmap-end-state-matrix.md Section 2 for E14. Implement the required roadmap steps in order from docs/roadmap.md. Verify each step; update Current progress in docs/implementation-kickoff.md as you go. When E14 passes, report back. Do not start Phase 6 or 8 until we say so.
```

**C3 — Pass-and-play**

```
Review docs/implementation-kickoff.md. Your goal is end-state test E16 (Pass-and-play Tic Tac Toe). Use docs/roadmap-end-state-matrix.md Section 2 for E16. Implement the required steps in order; update Current progress. When E16 passes, report back. Do not start Phase 8 until we say so.
```

**C4 — Multi-device Tic Tac Toe**

```
Review docs/implementation-kickoff.md. Your goal is end-state test E23 (Multi-device Tic Tac Toe, moves sync). Use docs/roadmap-end-state-matrix.md Section 2 for E23. Read Bluetooth/sync decision docs per AGENTS.md. Implement required steps in order; update Current progress. When E23 passes, report back.
```

**C5 — Dots**

```
Review docs/implementation-kickoff.md. Your goal is Dots: E26, E27, E28. Use docs/roadmap-end-state-matrix.md Section 2 for those tests. Implement required roadmap steps (9.1, 9.2, 10.1 as needed). Assume Phases 1–5 are done. Update Current progress. When E26–E28 pass, report back.
```

**C6 — Connect 4**

```
Review docs/implementation-kickoff.md. Your goal is Connect 4: E29, E30, E31. Use docs/roadmap-end-state-matrix.md Section 2. Implement 9.3, 9.4, 10.1 as needed. Update Current progress. When E29–E31 pass, report back.
```

**C7 — Polish**

```
Review docs/implementation-kickoff.md. Your goal is polish: E32–E35. Use docs/roadmap-end-state-matrix.md Section 2. Implement 10.1–10.4. Update Current progress. When E32–E35 pass, report back.
```

**C8 — Settings & player identity**

```
Review docs/implementation-kickoff.md. Your goal is E06–E08, E17–E19 (settings persist, settings screen, in-game colors/names, PlayerStrip). Use docs/roadmap-end-state-matrix.md Section 2. Implement 2.1, 2.2, 7.1, 7.2, 7.3 (and earlier steps if needed). Update Current progress. When those tests pass, report back.
```
