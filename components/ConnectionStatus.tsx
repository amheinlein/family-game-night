import { View, Text, StyleSheet } from "react-native";

interface ConnectionStatusProps {
  connected: boolean;
  message?: string;
}

export function ConnectionStatus({ connected, message }: ConnectionStatusProps) {
  if (connected) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message ?? "Disconnected"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, backgroundColor: "#fff3cd", borderRadius: 8, marginBottom: 8 },
  text: { fontSize: 14, color: "#856404" },
});
