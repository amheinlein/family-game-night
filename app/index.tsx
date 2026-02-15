import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family Game Night</Text>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/play")}
        >
          <Text style={styles.buttonText}>Play</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  buttons: {
    gap: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
