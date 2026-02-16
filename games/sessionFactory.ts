/**
 * Create initial game session. Imports games to trigger registry; builds session per gameType.
 */

import type { GameSession, GameMode, Player, GameType } from "../game-engine/types";
import type { UserSettings } from "../game-engine/types";
import { createInitialTicTacToeState } from "./tic-tac-toe";
import { createInitialDotsState } from "./dots";
import { createInitialConnect4State } from "./connect4";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createSession(
  gameType: GameType,
  mode: GameMode,
  settings: UserSettings
): GameSession {
  const sessionId = generateId();
  let players: Player[];
  let state: GameSession["state"];

  if (gameType === "tic-tac-toe") {
    state = createInitialTicTacToeState();
  } else if (gameType === "dots") {
    const size = Math.min(9, Math.max(5, settings.dotsGridSize ?? 6));
    state = createInitialDotsState(size, size);
  } else if (gameType === "connect4") {
    state = createInitialConnect4State();
  } else {
    throw new Error(`createSession: unsupported gameType ${gameType}`);
  }

  if (mode === "single") {
    players = [
      { id: generateId(), displayName: settings.displayName, order: 0 },
      { id: "ai", displayName: "AI", order: 1 },
    ];
  } else {
    // Player 1 == Me: use display name and "my color" for Player 1
    players = [
      { id: generateId(), displayName: settings.displayName, order: 0 },
      { id: generateId(), displayName: "Player 2", order: 1 },
    ];
  }

  return {
    id: sessionId,
    gameType,
    mode,
    players,
    state,
    currentTurnIndex: 0,
    status: "active",
    createdAt: Date.now(),
  };
}
