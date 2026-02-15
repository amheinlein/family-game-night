/**
 * Game engine runner: dispatch actions, query turn/winner/game-over.
 * Uses the game contract from the registry.
 */

import type { GameSession, GameAction, Player } from "./types";
import { getGame } from "./registry";

function augmentActionWithPlayerId(
  session: GameSession,
  action: GameAction
): GameAction {
  const currentId = session.players[session.currentTurnIndex]?.id;
  if (!currentId) return action;
  if (session.gameType === "tic-tac-toe" && action.type === "PLACE") {
    return { ...action, playerId: currentId };
  }
  if (session.gameType === "dots" && action.type === "DRAW_LINE") {
    return { ...action, playerId: currentId };
  }
  if (session.gameType === "connect4" && action.type === "DROP") {
    return { ...action, playerId: currentId };
  }
  return action;
}

export function dispatchAction(
  session: GameSession,
  action: GameAction
): GameSession | null {
  const contract = getGame(session.gameType);
  if (!contract) return null;
  const augmented = augmentActionWithPlayerId(session, action);
  if (!contract.validate(session.state, augmented as never)) return null;
  const nextState = contract.reducer(session.state, augmented as never);
  const winnerIndex = contract.getWinner(nextState, session.players);
  const isDraw = contract.isDraw(nextState);
  const status = winnerIndex != null ? "winner" : isDraw ? "draw" : "active";
  const nextTurnIndex =
    status === "active"
      ? contract.getCurrentTurnPlayerIndex(nextState, session.players)
      : session.currentTurnIndex;
  return {
    ...session,
    state: nextState,
    currentTurnIndex: nextTurnIndex,
    status,
    winnerIndex: winnerIndex ?? undefined,
    lastActionAt: Date.now(),
  };
}

export function getCurrentTurn(session: GameSession): Player | null {
  const contract = getGame(session.gameType);
  if (!contract) return null;
  const index = contract.getCurrentTurnPlayerIndex(session.state, session.players);
  return session.players[index] ?? null;
}

export function getWinner(session: GameSession): Player | null {
  const contract = getGame(session.gameType);
  if (!contract) return null;
  const index = contract.getWinner(session.state, session.players);
  return index != null ? session.players[index] ?? null : null;
}

export function isGameOver(session: GameSession): boolean {
  return session.status === "winner" || session.status === "draw";
}
