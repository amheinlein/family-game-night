/**
 * Game contract: interface that all games must implement.
 * Used by the game engine runner and registry. See docs/game-contract.md.
 */

import type { Player } from "./types";

export type PaperStyle = "lined" | "graph" | "blank";

export interface GameMetadata {
  name: string;
  image: string;
  description?: string;
  paperStyle: PaperStyle;
}

/**
 * Contract every game must implement. TState and TAction are game-specific
 * (e.g. TicTacToeState/TicTacToeAction, DotsState/DotsAction).
 */
export interface GameContract<TState, TAction> {
  /** Pure reducer: (state, action) => new state. */
  reducer: (state: TState, action: TAction) => TState;

  /** Returns true if the action is valid in the current state. */
  validate: (state: TState, action: TAction) => boolean;

  /** Index into players[] for whose turn it is. */
  getCurrentTurnPlayerIndex: (state: TState, players: Player[]) => number;

  /** Player index of winner, or null if no winner yet. */
  getWinner: (state: TState, players: Player[]) => number | null;

  /** True if game is a draw (no winner, no moves left). */
  isDraw: (state: TState) => boolean;

  /** Last move for "highlight previous move" UI (e.g. { row, col } or edgeKey). */
  getLastMove: (state: TState) => unknown | null;

  /** Returns an AI strategy function for the given difficulty (1–10). Returns null if no AI. */
  getAIStrategy: (difficulty: number) => ((state: TState) => TAction | null) | null;

  /** Display and paper style for the game. */
  metadata: GameMetadata;
}
