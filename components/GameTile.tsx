import { View, Text, StyleSheet, Pressable } from "react-native";

interface GameTileProps {
  name: string;
  onPress?: () => void;
}

export function GameTile({ name, onPress }: GameTileProps) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={styles.placeholderImage} />
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
  },
  placeholderImage: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  name: { fontSize: 16, fontWeight: "600" },
});
