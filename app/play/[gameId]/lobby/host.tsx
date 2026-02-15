import { View, Text, StyleSheet } from "react-native";

export default function LobbyHostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Lobby (Host) — requires Bluetooth. Coming in Phase 8.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  placeholder: { fontSize: 16, color: "#666", textAlign: "center" },
});
