# Game Contract

All games in Family Game Night implement the same **GameContract** interface so the game shell, runner, and sync layer can work with any game without game-specific code.

## Interface

Defined in `game-engine/contract.ts` as `GameContract<TState, TAction>`.

| Member | Type | Description |
|--------|------|-------------|
| `reducer` | `(state, action) => state` | Pure reducer; produces new state from action. |
| `validate` | `(state, action) => boolean` | True if the action is valid in the current state. |
| `getCurrentTurnPlayerIndex` | `(state, players) => number` | Index into `players[]` for current turn. |
| `getWinner` | `(state, players) => number \| null` | Winner's player index, or null. |
| `isDraw` | `(state) => boolean` | True if game is a draw. |
| `getLastMove` | `(state) => unknown \| null` | Last move for highlight (e.g. `{ row, col }`). |
| `getAIStrategy` | `(difficulty) => (state) => action \| null` | AI strategy for difficulty 1–10; null if no AI. |
| `metadata` | `GameMetadata` | `name`, `image`, optional `description`, `paperStyle` ('lined' \| 'graph' \| 'blank'). |

## Usage

- **Runner** uses `reducer`, `validate`, and the query methods to dispatch actions and compute turn/winner/draw.
- **Registry** maps `gameType` (e.g. `'tic-tac-toe'`) to a contract instance.
- **Sync** sends only validated actions; all devices apply the same reducer.

## Adding a new game

1. Define state and action types (see `docs/datamodels.md`).
2. Implement `GameContract<YourState, YourAction>` in `games/your-game/index.ts`.
3. Register in `game-engine/registry.ts`.
