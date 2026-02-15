import { View, Text, StyleSheet, Pressable } from "react-native";
import type { TicTacToeState, Player } from "../../game-engine/types";

interface TicTacToeBoardProps {
  state: TicTacToeState;
  players: Player[];
  colors: [string, string]; // color for player 0, player 1
  onPlace: (row: number, col: number) => void;
  disabled?: boolean;
}

export function TicTacToeBoard({
  state,
  players,
  colors,
  onPlace,
  disabled,
}: TicTacToeBoardProps) {
  const board = state.board;
  const getPlayerIndex = (playerId: string | null): number =>
    playerId == null ? -1 : players.findIndex((p) => p.id === playerId);

  return (
    <View style={styles.container}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.row}>
          {[0, 1, 2].map((col) => {
            const cell = board[row][col];
            const playerIndex = getPlayerIndex(cell);
            const isX = playerIndex === 0;

            return (
              <Pressable
                key={col}
                style={styles.cell}
                onPress={() => !disabled && cell == null && onPlace(row, col)}
              >
                {cell != null && playerIndex >= 0 ? (
                  <Text
                    style={[
                      styles.markerText,
                      { color: colors[playerIndex] ?? "#000" },
                    ]}
                  >
                    {isX ? "X" : "O"}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: "row" },
  cell: {
    width: 72,
    height: 72,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: { fontSize: 28, fontWeight: "bold" },
});
