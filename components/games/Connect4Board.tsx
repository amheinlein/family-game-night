import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Connect4State, Player } from "../../game-engine/types";

interface Connect4BoardProps {
  state: Connect4State;
  players: Player[];
  colors: [string, string];
  onDrop: (col: number) => void;
  disabled?: boolean;
}

const CELL = 36;

export function Connect4Board({
  state,
  players,
  colors,
  onDrop,
  disabled,
}: Connect4BoardProps) {
  const { rows, cols, columns } = state;
  const getColor = (playerId: string | null) => {
    if (playerId == null) return "transparent";
    const idx = players.findIndex((p) => p.id === playerId);
    return idx >= 0 ? colors[idx] : "#888";
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {Array.from({ length: cols }).map((_, c) => (
          <Pressable
            key={c}
            style={styles.colBtn}
            onPress={() => !disabled && columns[c].some((x) => x == null) && onDrop(c)}
          >
            <Text style={styles.colBtnText}>↓</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.grid, { width: cols * CELL }]}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const cell = columns[c][rows - 1 - r];
          return (
            <View
              key={i}
              style={[styles.cell, { backgroundColor: getColor(cell) || "#e0e0e0" }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  buttons: { flexDirection: "row", justifyContent: "center", gap: 4, marginBottom: 8 },
  colBtn: {
    width: CELL,
    height: 28,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  colBtnText: { color: "#fff", fontSize: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: CELL - 4,
    height: CELL - 4,
    margin: 2,
    borderRadius: (CELL - 4) / 2,
  },
});
