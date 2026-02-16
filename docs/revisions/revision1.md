## High level revelation

Player 1 == Me. In multi-player (single-device and multi-device), ensure Player 1's name is the display name from settings and the color is "my color" from settings.

---

## Items that need addressed from the implementation

- **Player colors in multi-player 1 device** — Both players use "player 2" color.
- **Dots game** — Needs re-work:
  - Grid size option in settings
  - Click-and-drag between two dots to make a line (not tap on invisible edge)
  - Use graph paper visual
- **Tic Tac Toe** — Remove outer border; use lined paper; animate drawing X/O on click
- **Animated drawing the screen** — Board should draw in when game loads
- **Connect 4** — Buttons and game don't align; board should look like physical Connect 4 (rectangle with holes, tokens visible in slots)

---

## Implementation plan

### 1. Player 1 == Me (straightforward — implement now)

| Task | File(s) | Change |
|------|---------|--------|
| Set `myPlayerId` for single-device | `app/play/[gameId]/game.tsx` | Use `session.players[0]?.id` when `mode === "singleDevice"` (currently only set for `mode === "single"`) |
| Player 1 displayName in single-device | `games/sessionFactory.ts` | For non-single mode, set Player 1's `displayName` to `settings.displayName` instead of "Player 1" |

**Root cause:** `myPlayerId` is `null` for single-device, so `getPlayerColor` falls through to `opponent1Color` for both players. Player 1 also gets hardcoded "Player 1" instead of settings display name.

---

### 2. Dots game re-work (moderate scope — design choices needed)

| Task | Effort | Notes |
|------|--------|-------|
| **Grid size in settings** | Small | Add `dotsGridSize` (e.g. 3–6) to `UserSettings` or game-specific settings; wire to `createInitialDotsState`. |
| **Drag between dots** | Medium | Replace tap-on-edge with `PanResponder` or gesture: track touch start (nearest dot) and touch end (nearest dot); if adjacent, compute edge key and dispatch `DRAW_LINE`. Need clear visual feedback during drag (preview line). |
| **Graph paper** | Small | `PaperCanvas` graph style currently has no visible grid. Add SVG/View-based grid lines; wrap `DotsBoard` in `PaperCanvas` with `paperStyle="graph"`. |

**Resolved:** Grid size 5×5 to 9×9 (implemented).

---

### 3. Tic Tac Toe (straightforward to moderate)

| Task | Effort | Notes |
|------|--------|-------|
| **Remove outer border** | Small | Tweak cell borders so outer edge of grid has no double border; use shared inner borders only. |
| **Lined paper** | Small | Wrap `TicTacToeBoard` in `PaperCanvas` with `paperStyle="lined"`. Add horizontal ruled lines to PaperCanvas for "lined" style (currently missing). |
| **Animate X/O drawing** | Medium | X: two diagonal strokes (top-left→bottom-right, then top-right→bottom-left). O: circular stroke from top, like progress spinner. Implemented with react-native-svg. |

---

### 4. Animated drawing the screen

| Task | Effort | Notes |
|------|--------|-------|
| Board draw-in animation | Medium | **Tic Tac Toe:** Draw grid lines \| \| - - over GAME_DRAW_ANIMATION_MS. **Dots:** Blank screen, fill dots row-by-row. **Connect 4:** Rectangle → circles → grey fill sweeps from left. Implemented. |

---

### 5. Connect 4 (moderate scope)

| Task | Effort | Notes |
|------|--------|-------|
| **Align buttons with columns** | Small | Ensure drop buttons sit exactly above each column; same width as column cells; no gap mismatch. |
| **Physical board look** | Medium | Redesign: draw board frame (rectangle) with circular holes; tokens in slots; grey fill. Implemented with rect→holes→grey fade. |

---

## Implementation status

- [x] **1. Player 1 == Me** — Implemented
- [x] **2. Dots** — Grid size 5–9 in Settings; row-by-row draw animation. (Drag + graph paper pending.)
- [x] **3. Tic Tac Toe** — Grid draw | | - -; X/O stroke animations; no outer border
- [x] **4. Draw animation** — All three games have board draw-in
- [x] **5. Connect 4** — Physical board (rect, holes, grey sweep); buttons aligned

---

## Resolved clarifications

1. **Dots grid size:** 5×5 to 9×9.
2. **Draw animation:** X = two diagonal strokes; O = circular stroke from top (spinner-like).
3. **Connect 4:** Physical board done in same pass.



## Revision1 still not resolved:
OK Lets keep working in @docs/revisions/revision1.md . The drawing operations are ALMOST good on tictactoe. The actual animations are perfect, but at the end, the X bottom half disappears. The items are also not centered in the grid making the UI look pretty funky

Dots game still appears to be "click on dot" -> a line is drawn. I need to be able to click on a dot and drag to another dot.
For this animation, a line should be shown on screen from the dot to the cursor/where finger is holding. When it is touching a dot or close enough, it should "snap" into place so its clear when they release it will be drawn connecting the two dots.
We need to ensure that they dont connect dots which are invalid moves. This may already be implemented properly, but impossible to tell since i dont know which line will be drawn from clicking on a dot in its current iteration.

Connect 4 looks good.

OK last thing on this @docs/revisions/revision1.md the paper is still not great.
the paper styles are completely not visible. we can address this in a future revision, but for now lets remove anything revision1 attempted to solve for this and remove it from the scope of the revision1 document
