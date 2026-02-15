import { View, Text, StyleSheet, Pressable } from "react-native";
import { CRAYOLA_8_COLORS } from "../constants";

interface ColorPickerProps {
  label: string;
  value: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ label, value, onSelect }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.swatches}>
        {CRAYOLA_8_COLORS.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.swatch,
              { backgroundColor: color },
              value === color && styles.swatchSelected,
            ]}
            onPress={() => onSelect(color)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: "500" },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: { borderColor: "#000", borderWidth: 3 },
});
