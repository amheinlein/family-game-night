/**
 * Game registry: maps gameType to GameContract instances.
 */

import type { GameType } from "./types";
import type { GameContract } from "./contract";
import type { GameState, GameAction } from "./types";

const registry = new Map<GameType, GameContract<GameState, GameAction>>();

export function registerGame(
  gameType: GameType,
  contract: GameContract<GameState, GameAction>
): void {
  registry.set(gameType, contract);
}

export function getGame(
  gameType: GameType
): GameContract<GameState, GameAction> | null {
  return registry.get(gameType) ?? null;
}
