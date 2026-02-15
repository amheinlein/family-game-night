/**
 * Connect 4 game contract.
 */

import type { Player, PlayerId } from "../../game-engine/types";
import type { GameContract } from "../../game-engine/contract";
import type { Connect4State, Connect4Action } from "../../game-engine/types";
import { registerGame } from "../../game-engine/registry";
import type { GameState, GameAction } from "../../game-engine/types";

const ROWS = 6;
const COLS = 7;

function dropInColumn(columns: (PlayerId | null)[][], col: number, playerId: PlayerId): number | null {
  for (let r = 0; r < columns[col].length; r++) {
    if (columns[col][r] == null) {
      columns[col][r] = playerId;
      return r;
    }
  }
  return null;
}

function checkWinner(columns: (PlayerId | null)[][], rows: number, cols: number): PlayerId | null {
  const grid: (PlayerId | null)[][] = Array(rows)
    .fill(null)
    .map((_, r) => Array(cols).fill(null).map((_, c) => columns[c][rows - 1 - r]));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = grid[r][c];
      if (id == null) continue;
      if (c + 3 < cols && id === grid[r][c + 1] && id === grid[r][c + 2] && id === grid[r][c + 3])
        return id;
      if (r + 3 < rows && id === grid[r + 1][c] && id === grid[r + 2][c] && id === grid[r + 3][c])
        return id;
      if (r + 3 < rows && c + 3 < cols && id === grid[r + 1][c + 1] && id === grid[r + 2][c + 2] && id === grid[r + 3][c + 3])
        return id;
      if (r + 3 < rows && c >= 3 && id === grid[r + 1][c - 1] && id === grid[r + 2][c - 2] && id === grid[r + 3][c - 3])
        return id;
    }
  }
  return null;
}

function getCurrentTurnIndex(state: Connect4State): number {
  let count = 0;
  for (const col of state.columns) for (const cell of col) if (cell != null) count++;
  return count % 2;
}

const Connect4Contract: GameContract<Connect4State, Connect4Action> = {
  reducer(state, action) {
    if (action.type !== "DROP") return state;
    const { col, playerId } = action;
    if (col < 0 || col >= state.cols) return state;
    const columns = state.columns.map((c) => [...c]);
    const turnIndex = getCurrentTurnIndex(state);
    const id = (playerId ?? `__P${turnIndex}__`) as PlayerId;
    const row = dropInColumn(columns, col, id);
    if (row == null) return state;
    return {
      gameType: "connect4",
      rows: state.rows,
      cols: state.cols,
      columns,
      lastDrop: { col, row },
    };
  },

  validate(state, action) {
    if (action.type !== "DROP") return false;
    const { col } = action;
    if (col < 0 || col >= state.cols) return false;
    const column = state.columns[col];
    return column.some((c) => c == null);
  },

  getCurrentTurnPlayerIndex(state) {
    return getCurrentTurnIndex(state);
  },

  getWinner(state, players) {
    const winnerId = checkWinner(state.columns, state.rows, state.cols);
    if (winnerId == null) return null;
    const idx = players.findIndex((p) => p.id === winnerId);
    return idx >= 0 ? idx : null;
  },

  isDraw(state) {
    const full = state.columns.every((col) => col.every((c) => c != null));
    const winnerId = checkWinner(state.columns, state.rows, state.cols);
    return full && winnerId == null;
  },

  getLastMove(state) {
    return state.lastDrop ?? null;
  },

  getAIStrategy() {
    return (state: Connect4State): Connect4Action | null => {
      const validCols: number[] = [];
      for (let c = 0; c < state.cols; c++) {
        if (state.columns[c].some((cell) => cell == null)) validCols.push(c);
      }
      if (validCols.length === 0) return null;
      const col = validCols[Math.floor(Math.random() * validCols.length)];
      return { type: "DROP", col };
    };
  },

  metadata: {
    name: "Connect 4",
    image: "",
    paperStyle: "lined",
  },
};

export function createInitialConnect4State(rows = ROWS, cols = COLS): Connect4State {
  return {
    gameType: "connect4",
    rows,
    cols,
    columns: Array.from({ length: cols }, () => Array(rows).fill(null)),
  };
}

registerGame("connect4", Connect4Contract as GameContract<GameState, GameAction>);
export { Connect4Contract };
export type { Connect4State, Connect4Action };
