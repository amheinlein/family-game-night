import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Player, GameSession, UserSettings } from "../game-engine/types";
import type { PlayerId } from "../game-engine/types";
import { getPlayerColor } from "../settings/colorMapping";
import { getPlayerDisplayName } from "../settings/nameMapping";
import { ColorPicker } from "./ColorPicker";

interface PlayerStripProps {
  players: Player[];
  session: GameSession;
  settings: UserSettings;
  myPlayerId: PlayerId | null;
  onColorChange?: (playerId: PlayerId, color: string) => void;
  labels?: { player1: string; player2: string };
}

export function PlayerStrip({
  players,
  session,
  settings,
  myPlayerId,
  onColorChange,
  labels,
}: PlayerStripProps) {
  const [pickingFor, setPickingFor] = useState<PlayerId | null>(null);
  const defaultLabels = { player1: "Player 1", player2: "Player 2" };
  const l = labels ?? defaultLabels;

  return (
    <View style={styles.container}>
      {players.map((player, index) => {
        const color = getPlayerColor(player, session, myPlayerId, settings);
        const name = getPlayerDisplayName(player, myPlayerId, settings);
        const showPicker = onColorChange != null && pickingFor === player.id;

        return (
          <View key={player.id} style={styles.row}>
            <Pressable
              onPress={() => onColorChange && setPickingFor(pickingFor === player.id ? null : player.id)}
              style={[styles.swatch, { backgroundColor: color }]}
            />
            <Text style={styles.name}>{name}</Text>
            {showPicker ? (
              <ColorPicker
                label=""
                value={color}
                onSelect={(c) => {
                  onColorChange?.(player.id, c);
                  setPickingFor(null);
                }}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  swatch: { width: 24, height: 24, borderRadius: 12 },
  name: { fontSize: 16 },
});
