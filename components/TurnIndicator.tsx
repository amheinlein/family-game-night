import { View, Text, StyleSheet } from "react-native";
import type { Player } from "../game-engine/types";

interface TurnIndicatorProps {
  current: Player | null;
  previous: Player | null;
  next: Player | null;
  onLongPressPrevious?: () => void;
}

export function TurnIndicator({
  current,
  previous,
  next,
  onLongPressPrevious,
}: TurnIndicatorProps) {
  return (
    <View style={styles.container}>
      {previous && (
        <Text
          style={styles.label}
          onLongPress={onLongPressPrevious}
        >
          Previous: {previous.displayName}
        </Text>
      )}
      {current && (
        <Text style={[styles.label, styles.current]}>
          Current: {current.displayName}
        </Text>
      )}
      {next && (
        <Text style={styles.label}>
          Next: {next.displayName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 },
  label: { fontSize: 14, color: "#666" },
  current: { fontWeight: "600", color: "#000" },
});
