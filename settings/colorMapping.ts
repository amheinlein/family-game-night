/**
 * Map players to display colors from UserSettings (myColor, opponent1Color).
 */

import type { Player, GameSession, UserSettings } from "../game-engine/types";

export function getPlayerColor(
  player: Player,
  _session: GameSession,
  myPlayerId: string | null,
  settings: UserSettings
): string {
  if (myPlayerId != null && player.id === myPlayerId) return settings.myColor;
  return settings.opponent1Color;
}
