import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function LobbyChooseScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-Device</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push(`/play/${gameId}/lobby/host`)}
      >
        <Text style={styles.buttonText}>Host</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push(`/play/${gameId}/lobby/join`)}
      >
        <Text style={styles.buttonText}>Join</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  button: {
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
