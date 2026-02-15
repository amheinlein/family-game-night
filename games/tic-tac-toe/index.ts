/**
 * Tic Tac Toe game contract: reducer, validation, queries, AI, metadata.
 */

import type { Player, PlayerId } from "../../game-engine/types";
import type { GameContract } from "../../game-engine/contract";
import type { TicTacToeState, TicTacToeAction } from "../../game-engine/types";
import { registerGame } from "../../game-engine/registry";
import type { GameState, GameAction } from "../../game-engine/types";

const ROWS = 3;
const COLS = 3;

export function createInitialTicTacToeState(): TicTacToeState {
  return {
    gameType: "tic-tac-toe",
    board: Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null) as (PlayerId | null)[]),
  };
}

function getCurrentTurnIndex(state: TicTacToeState): number {
  let count = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) if (state.board[r][c] != null) count++;
  return count % 2;
}

function getWinnerIndex(state: TicTacToeState, players: Player[]): number | null {
  const board = state.board;
  for (let i = 0; i < 3; i++) {
    const row = board[i][0];
    if (row != null && row === board[i][1] && row === board[i][2]) {
      const idx = players.findIndex((p) => p.id === row);
      return idx >= 0 ? idx : null;
    }
  }
  for (let j = 0; j < 3; j++) {
    const col = board[0][j];
    if (col != null && col === board[1][j] && col === board[2][j]) {
      const idx = players.findIndex((p) => p.id === col);
      return idx >= 0 ? idx : null;
    }
  }
  const d1 = board[0][0];
  if (d1 != null && d1 === board[1][1] && d1 === board[2][2]) {
    const idx = players.findIndex((p) => p.id === d1);
    return idx >= 0 ? idx : null;
  }
  const d2 = board[0][2];
  if (d2 != null && d2 === board[1][1] && d2 === board[2][0]) {
    const idx = players.findIndex((p) => p.id === d2);
    return idx >= 0 ? idx : null;
  }
  return null;
}

function isBoardFull(state: TicTacToeState): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) if (state.board[r][c] == null) return false;
  return true;
}

const TicTacToeContract: GameContract<TicTacToeState, TicTacToeAction> = {
  reducer(state, action) {
    if (action.type !== "PLACE") return state;
    const { row, col, playerId } = action;
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return state;
    if (state.board[row][col] != null) return state;
    const turnIndex = getCurrentTurnIndex(state);
    const id = playerId ?? (turnIndex === 0 ? "__P0__" : "__P1__");
    const board = state.board.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? (id as PlayerId) : c))
    );
    return { gameType: "tic-tac-toe", board, lastMove: { row, col } };
  },

  validate(state, action) {
    if (action.type !== "PLACE") return false;
    const { row, col } = action;
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
    if (state.board[row][col] != null) return false;
    return true;
  },

  getCurrentTurnPlayerIndex(state, players) {
    return getCurrentTurnIndex(state);
  },

  getWinner(state, players) {
    return getWinnerIndex(state, players);
  },

  isDraw(state) {
    return getWinnerIndex(state, []) == null && isBoardFull(state);
  },

  getLastMove(state) {
    return state.lastMove ?? null;
  },

  getAIStrategy() {
    return (state: TicTacToeState): TicTacToeAction | null => {
      const moves: { row: number; col: number }[] = [];
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (state.board[r][c] == null) moves.push({ row: r, col: c });
      if (moves.length === 0) return null;
      const idx = Math.floor(Math.random() * moves.length);
      const m = moves[idx];
      return { type: "PLACE", row: m.row, col: m.col };
    };
  },

  metadata: {
    name: "Tic Tac Toe",
    image: "",
    paperStyle: "lined",
  },
};

registerGame("tic-tac-toe", TicTacToeContract as GameContract<GameState, GameAction>);

export { TicTacToeContract };
export type { TicTacToeState, TicTacToeAction };
