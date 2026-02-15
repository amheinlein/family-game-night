/**
 * Display name for a player: use settings.displayName for "me", else player.displayName.
 */

import type { Player, UserSettings } from "../game-engine/types";

export function getPlayerDisplayName(
  player: Player,
  myPlayerId: string | null,
  settings: UserSettings
): string {
  if (myPlayerId != null && player.id === myPlayerId) return settings.displayName;
  return player.displayName;
}
