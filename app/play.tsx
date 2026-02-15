import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { GameTile } from "../components/GameTile";
import { getGame } from "../game-engine/registry";
import "../games/tic-tac-toe";
import "../games/dots";
import "../games/connect4";

const GAME_TYPES = ["tic-tac-toe", "dots", "connect4"] as const;

export default function PlayScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose a game</Text>
      <View style={styles.grid}>
        {GAME_TYPES.map((gameType) => {
          const contract = getGame(gameType);
          const name = contract?.metadata.name ?? gameType;
          const implemented = contract != null;
          return (
            <GameTile
              key={gameType}
              name={name}
              onPress={
                implemented
                  ? () => router.push(`/play/${gameType}`)
                  : undefined
              }
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
});
