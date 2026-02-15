import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getGame } from "../../../game-engine/registry";
import "../../../games/tic-tac-toe"; // register Tic Tac Toe

export default function GameMenuScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const contract = gameId ? getGame(gameId as "tic-tac-toe" | "dots" | "connect4") : null;
  const name = contract?.metadata.name ?? gameId ?? "Game";

  const navigateToGame = (mode: "single" | "singleDevice" | "multiDevice") => {
    if (mode === "multiDevice") {
      router.push(`/play/${gameId}/lobby/choose`);
    } else {
      router.push(`/play/${gameId}/game?mode=${mode}`);
    }
  };

  if (!gameId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Missing game</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => navigateToGame("single")}
        >
          <Text style={styles.buttonText}>Single Player</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigateToGame("singleDevice")}
        >
          <Text style={styles.buttonText}>Multi-Player 1 Device</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigateToGame("multiDevice")}
        >
          <Text style={styles.buttonText}>Multi-Player Multiple Devices</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 32, textAlign: "center" },
  error: { fontSize: 18, color: "#666" },
  buttons: { gap: 16 },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
