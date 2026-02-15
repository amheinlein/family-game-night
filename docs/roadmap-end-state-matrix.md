# End-State Test Matrix

This document defines the **end-state test cases** — the full set of scenarios the product must pass when the roadmap is complete (Phase 10). It cross-references each test case to the **roadmap steps** required to pass it, so we can:

- Verify we capture everything in a logical order
- See which steps unblock which outcomes
- Track progress by how many end-state tests pass
- Guide implementation (e.g. "implement steps needed for E14 next")

**Related:** [Implementation Roadmap](roadmap.md) | [Architecture](architecture.md) | [Data Models](datamodels.md)

---

## 1. End-state test cases

Each row is one testable scenario that must pass at ship. **Category** groups related tests; **ID** is used in the matrix below.

| ID   | Name | Description | Category |
|------|------|-------------|----------|
| E01  | App launches | Expo app runs on iOS/Android simulator or device; no crash on start | Foundation |
| E02  | Navigation (Home ↔ Play, Settings) | Home shows Play and Settings; tapping each navigates correctly; back returns to home | Foundation |
| E03  | Core types match datamodels | TypeScript compiles; Player, GameSession, UserSettings, game states/actions match docs | Foundation |
| E04  | Constants available | GAME_DRAW_ANIMATION_MS, CRAYOLA_8_COLORS, DEFAULT_* exist and have correct values | Foundation |
| E05  | Game contract implementable | GameContract interface is defined; a game can implement it and type-check | Foundation |
| E06  | Settings persist | loadSettings/saveSettings work; defaults when none saved; values survive app restart | Settings |
| E07  | Settings screen (form + save) | Settings screen shows difficulty, display name, my color, opponent1 color; save persists | Settings |
| E08  | Settings reflected in-game | My color, opponent color, and display name from Settings appear correctly in game UI | Settings |
| E09  | Home screen (Play + Settings) | Home renders with Play and Settings buttons/links; clear and usable | UI structure |
| E10  | Play screen shows game grid | Play screen shows tiles from game registry (Tic Tac Toe, Dots, Connect 4); scrollable if needed | UI structure |
| E11  | Tap game tile → game menu | Tapping a game tile opens that game’s menu (Single / 1 device / Multi-device) | UI structure |
| E12  | Tic Tac Toe in grid | Tic Tac Toe appears in play grid with name and image; tappable | Tic Tac Toe |
| E13  | Game menu (three options) | Game menu shows Single Player, Multi-Player 1 Device, Multi-Player Multiple Devices; game name from metadata | Tic Tac Toe |
| E14  | Single-player Tic Tac Toe (full game) | Play vs AI: place marker, AI responds, turns alternate, win or draw detected and shown | Tic Tac Toe |
| E15  | Tic Tac Toe board (interaction) | 3×3 grid; tap empty cell places marker; occupied/invalid taps rejected; X/O or colors visible | Tic Tac Toe |
| E16  | Pass-and-play Tic Tac Toe | Two human players on one device; no AI; turn indicator correct; win/draw shown | Single-device |
| E17  | Single-player colors from settings | In single-player Tic Tac Toe, “my” markers use myColor, AI uses opponent1Color from Settings | Player identity |
| E18  | PlayerStrip in Settings | Settings uses PlayerStrip (or equivalent): My color, Opponent 1 color; tap to change; save persists | Player identity |
| E19  | PlayerStrip in-game (names + colors) | In-game strip shows player names and colors; “me” uses displayName from Settings | Player identity |
| E20  | Multi-device: Host advertises, Join discovers | Host creates lobby and advertises; Join scans and sees available game(s) | Multi-device |
| E21  | Multi-device: Join joins lobby | Join joins lobby; Host sees joined player in list; both see same lobby state | Multi-device |
| E22  | Multi-device: Host starts → both in game | Host taps Start; both devices navigate to game screen with same session | Multi-device |
| E23  | Multi-device Tic Tac Toe (sync) | Host and Join play Tic Tac Toe; moves appear on both; win/draw shown on both; state stays in sync | Multi-device |
| E24  | Game menu → Host/Join for multi-device | “Multi-Player Multiple Devices” leads to Host vs Join choice; navigation to host/join screens works | Multi-device |
| E25  | Disconnect handling | If Bluetooth disconnects mid-game, UI shows disconnected state; no crash; option to reconnect or exit | Multi-device / Polish |
| E26  | Dots in grid + menu | Dots appears in play grid; tap opens game menu; Single / 1 device / Multi-device options work | Dots |
| E27  | Single-player Dots (full game) | Draw lines, complete box (extra turn), boxes colored by player; game end when no moves left | Dots |
| E28  | Dots board (graph paper) | Dots board uses graph-paper style per game metadata | Dots / Polish |
| E29  | Connect 4 in grid + menu | Connect 4 appears in play grid; tap opens game menu; mode options work | Connect 4 |
| E30  | Single-player Connect 4 (full game) | Drop in column; pieces stack; 4-in-a-row detected; win shown | Connect 4 |
| E31  | Connect 4 board (lined paper) | Connect 4 board uses lined-paper style per game metadata | Connect 4 / Polish |
| E32  | Paper aesthetic (all games) | Tic Tac Toe and Connect 4: lined; Dots: graph; consistent paper look (texture/color) | Polish |
| E33  | Draw animation on game load | When game screen loads, board “draws” in over GAME_DRAW_ANIMATION_MS (e.g. ~2s); skippable if implemented | Polish |
| E34  | Turn indicator (current/next/previous + highlight) | Turn indicator shows current, next, previous; long-press previous highlights last move on board | Polish |
| E35  | Error handling (no raw errors) | Disconnect shows clear UI; invalid actions handled; no raw stack traces to user; background/foreground ok | Polish |

---

## 2. Matrix: End-state test → Roadmap steps required

For each end-state test, the **minimal set of roadmap steps** that must be complete for that test to pass. Order of steps is implied by the roadmap; steps listed here are dependencies, not necessarily the only steps that touch that area.

| End-state | Required roadmap steps |
|-----------|-------------------------|
| E01       | 1.1 |
| E02       | 1.1, 3.1 |
| E03       | 1.1, 1.2 |
| E04       | 1.1, 1.3 |
| E05       | 1.1, 1.2, 1.4 |
| E06       | 1.1, 1.2, 2.1 |
| E07       | 1.1, 1.2, 1.3, 2.1, 2.2 |
| E08       | 1.1–1.4, 2.1, 2.2, 4.1, 4.2, 5.1–5.5, 7.1, 7.2, 7.3 |
| E09       | 1.1, 3.1 |
| E10       | 1.1, 1.2, 3.2, 4.2, 5.1, 5.5 (+ 9.1, 9.3 for Dots/Connect 4 in grid) |
| E11       | 1.1, 3.1, 3.2, 4.2, 5.4, 5.5 |
| E12       | 1.1, 1.2, 3.2, 4.2, 5.1, 5.5 |
| E13       | 1.1, 1.2, 4.2, 5.1, 5.4 |
| E14       | 1.1–1.4, 2.1, 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 5.5 |
| E15       | 1.1, 1.2, 4.1, 4.2, 5.1, 5.2, 5.3 |
| E16       | All for E14, plus 6.1 |
| E17       | All for E14, plus 7.1, 7.3 |
| E18       | 1.1, 1.2, 1.3, 2.1, 2.2, 7.3 |
| E19       | All for E14, plus 7.2, 7.3 |
| E20       | 1.1, 1.2, 8.1, 8.2 |
| E21       | 1.1, 1.2, 8.1, 8.2, 8.3, 8.4, 8.5 |
| E22       | 1.1, 1.2, 4.1, 4.2, 5.1, 8.1–8.5 |
| E23       | 1.1–1.4, 2.1, 4.1, 4.2, 5.1–5.5, 8.1–8.6 |
| E24       | 1.1, 3.1, 4.2, 5.1, 5.4, 8.7 |
| E25       | 8.2, 8.3, 8.6, 10.4 |
| E26       | 1.1, 1.2, 3.2, 4.2, 5.4, 5.5, 9.1 |
| E27       | All for E14 (engine/shell), but with 9.1, 9.2 instead of 5.1, 5.2 |
| E28       | 9.1, 9.2, 10.1 |
| E29       | 1.1, 1.2, 3.2, 4.2, 5.4, 5.5, 9.3 |
| E30       | Same engine/shell as E14, with 9.3, 9.4 (Connect 4 contract + UI) |
| E31       | 9.3, 9.4, 10.1 |
| E32       | 5.2, 9.2, 9.4, 10.1 |
| E33       | 5.2, 9.2, 9.4, 10.2 (and game screen/shell that shows board) |
| E34       | 5.2, 5.3, 9.2, 9.4, 10.3 (turn indicator + board highlight) |
| E35       | 8.3, 8.6, 10.4 (and general error handling in shell/UI) |

---

## 3. Matrix: Roadmap step → End-state tests unblocked

Reverse view: which end-state tests **first become passable** once this step is done (assuming previous steps are already complete). Helps confirm every step contributes to at least one end-state and shows the “critical path” for a given test.

| Step | End-state tests this step helps unblock |
|------|----------------------------------------|
| 1.1 | E01, E02, E03, E04, E05, E06, E07, E09, E10, E11, E12, E13, E14, E15, E16, E17, E18, E19, E20, E21, E22, E23, E24, E26, E29 |
| 1.2 | E03, E05, E06, E07, E08, E10, E11, E12, E13, E14, E15, E16, E17, E18, E19, E20, E21, E22, E23, E26, E29 |
| 1.3 | E04, E07, E18 |
| 1.4 | E05, E08, E14, E15, E23 |
| 2.1 | E06, E07, E08, E14, E18, E23 |
| 2.2 | E07, E08, E18 |
| 3.1 | E02, E09, E11, E24 |
| 3.2 | E10, E11, E12, E26, E29 |
| 4.1 | E08, E14, E15, E22, E23 |
| 4.2 | E08, E10, E11, E12, E13, E14, E15, E22, E23, E24, E26, E29 |
| 5.1 | E10, E12, E13, E14, E15, E22, E23, E24, E26, E29 |
| 5.2 | E14, E15, E23, E32, E33, E34 |
| 5.3 | E14, E23, E34 |
| 5.4 | E11, E13, E24, E26, E29 |
| 5.5 | E10, E11, E12, E14, E26, E29 |
| 6.1 | E16 |
| 7.1 | E08, E17 |
| 7.2 | E08, E19 |
| 7.3 | E08, E17, E18, E19 |
| 8.1 | E20, E21, E22, E23, E24 |
| 8.2 | E20, E21, E22, E23, E25 |
| 8.3 | E21, E23, E25, E35 |
| 8.4 | E21, E22, E23 |
| 8.5 | E21, E22, E23 |
| 8.6 | E23, E25, E35 |
| 8.7 | E24 |
| 9.1 | E10, E26, E27, E28, E32 |
| 9.2 | E27, E28, E32, E33, E34 |
| 9.3 | E10, E29, E30, E31, E32 |
| 9.4 | E30, E31, E32, E33, E34 |
| 10.1 | E28, E31, E32 |
| 10.2 | E33 |
| 10.3 | E34 |
| 10.4 | E25, E35 |

---

## 4. Coverage notes

- **E08, E14, E23** depend on the largest sets of steps (full chain from foundation through game + settings + player identity or multi-device). They are good “full stack” progress indicators.
- **E01–E05** validate Phase 1; passing them means foundation is in place for the rest.
- **E20–E25** depend on Phase 8 (Bluetooth); E25 and E35 also depend on 10.4 (error handling).
- Every roadmap step (1.1 through 10.4) appears in at least one end-state’s required set, so no step is orphaned.
- **Pass-and-play** for Dots and Connect 4 is implied by E16’s pattern (same game screen with 6.1); not given separate E IDs to keep the matrix smaller. If you want explicit E26/E30 variants for “pass-and-play Dots/Connect 4”, they can be added.

---

## 5. How to use this with the roadmap

1. **Before implementing:** For the next roadmap step, check Section 3 to see which end-state tests it unblocks.
2. **After implementing:** Run or manually verify the end-state tests that list that step in Section 2; mark them in your tracking (e.g. in the roadmap or a separate test-run log).
3. **Planning a “batch”:** Pick a target end-state (e.g. E14). Section 2 gives the minimal step set; implement those in roadmap order until the test passes.
4. **Checking completeness:** Ensure every end-state test has a non-empty “Required roadmap steps” set and that every roadmap step appears in Section 3.

If you add a new roadmap step or a new end-state test, update both Section 2 and Section 3 so the matrices stay in sync.
