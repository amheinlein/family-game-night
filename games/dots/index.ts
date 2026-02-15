/**
 * Dots (Boxes) game contract. Extra-turn rule: completing a box gives another turn.
 */

import type { Player, PlayerId } from "../../game-engine/types";
import type { GameContract } from "../../game-engine/contract";
import type { DotsState, DotsAction } from "../../game-engine/types";
import { registerGame } from "../../game-engine/registry";
import type { GameState, GameAction } from "../../game-engine/types";

const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;

function parseEdgeKey(key: string): { r: number; c: number; h: boolean } | null {
  const parts = key.split(",");
  if (parts.length !== 3) return null;
  const r = parseInt(parts[0], 10);
  const c = parseInt(parts[1], 10);
  const h = parts[2] === "h";
  if (parts[2] !== "h" && parts[2] !== "v") return null;
  return { r, c, h: parts[2] === "h" };
}

function getEdgesForBox(rows: number, cols: number): string[][] {
  const boxes: string[][] = [];
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      boxes.push([
        `${r},${c},h`,
        `${r},${c},v`,
        `${r},${c + 1},h`,
        `${r + 1},${c},v`,
      ]);
    }
  }
  return boxes;
}

function getBoxKey(edgeList: string[]): string {
  const first = edgeList[0];
  const [r, c] = first.split(",").map(Number);
  return `${r},${c}`;
}

function completedBoxes(lines: string[], rows: number, cols: number): string[] {
  const set = new Set(lines);
  const boxEdges = getEdgesForBox(rows, cols);
  const completed: string[] = [];
  for (const edges of boxEdges) {
    if (edges.every((e) => set.has(e))) completed.push(getBoxKey(edges));
  }
  return completed;
}

function getCurrentTurnIndex(state: DotsState, _players: Player[]): number {
  const lineCount = state.lines.length;
  if (lineCount === 0) return 0;
  if (state.lastMovePlayerIndex != null) {
    const currCompleted = new Set(completedBoxes(state.lines, state.rows, state.cols));
    const prevCompleted = new Set(completedBoxes(state.lines.slice(0, -1), state.rows, state.cols));
    const justCompleted = currCompleted.size > prevCompleted.size;
    if (justCompleted) return state.lastMovePlayerIndex;
  }
  return lineCount % 2;
}

const DotsContract: GameContract<DotsState, DotsAction> = {
  reducer(state, action) {
    if (action.type !== "DRAW_LINE") return state;
    const { edgeKey, playerId } = action;
    if (state.lines.includes(edgeKey)) return state;
    const parsed = parseEdgeKey(edgeKey);
    if (!parsed) return state;
    const turnIndex = getCurrentTurnIndex(state, []);
    const id = (playerId ?? `__P${turnIndex}__`) as PlayerId;
    const lines = [...state.lines, edgeKey];
    const boxes = { ...state.boxes };
    const boxEdges = getEdgesForBox(state.rows, state.cols);
    for (const edges of boxEdges) {
      const key = getBoxKey(edges);
      if (edges.every((e) => lines.includes(e)) && !state.boxes[key]) boxes[key] = id;
    }
    const lastMovePlayerIndex = turnIndex;
    return {
      gameType: "dots",
      rows: state.rows,
      cols: state.cols,
      lines,
      boxes,
      lastLine: edgeKey,
      lastMovePlayerIndex,
    };
  },

  validate(state, action) {
    if (action.type !== "DRAW_LINE") return false;
    if (state.lines.includes(action.edgeKey)) return false;
    return parseEdgeKey(action.edgeKey) != null;
  },

  getCurrentTurnPlayerIndex(state, players) {
    return getCurrentTurnIndex(state, players);
  },

  getWinner(state, players) {
    const maxEdges = (state.rows - 1) * state.cols + state.rows * (state.cols - 1);
    if (state.lines.length < maxEdges) return null;
    const scores = [0, 0];
    for (const id of Object.values(state.boxes)) {
      const idx = players.findIndex((p) => p.id === id);
      if (idx >= 0) scores[idx]++;
    }
    if (scores[0] > scores[1]) return 0;
    if (scores[1] > scores[0]) return 1;
    return null;
  },

  isDraw(state) {
    const maxEdges = (state.rows - 1) * state.cols + state.rows * (state.cols - 1);
    if (state.lines.length < maxEdges) return false;
    const winner = this.getWinner(state, []);
    return winner == null;
  },

  getLastMove(state) {
    return state.lastLine ?? null;
  },

  getAIStrategy() {
    return (state: DotsState): DotsAction | null => {
      const maxEdges = (state.rows - 1) * state.cols + state.rows * (state.cols - 1);
      const possible: string[] = [];
      for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
          if (r < state.rows - 1) possible.push(`${r},${c},v`);
          if (c < state.cols - 1) possible.push(`${r},${c},h`);
        }
      }
      const valid = possible.filter((e) => !state.lines.includes(e));
      if (valid.length === 0) return null;
      const idx = Math.floor(Math.random() * valid.length);
      return { type: "DRAW_LINE", edgeKey: valid[idx] };
    };
  },

  metadata: {
    name: "Dots",
    image: "",
    paperStyle: "graph",
  },
};

export function createInitialDotsState(rows = DEFAULT_ROWS, cols = DEFAULT_COLS): DotsState {
  return {
    gameType: "dots",
    rows,
    cols,
    lines: [],
    boxes: {},
  };
}

registerGame("dots", DotsContract as GameContract<GameState, GameAction>);
export { DotsContract };
export type { DotsState, DotsAction };
