import { View, Text, StyleSheet } from "react-native";

export default function PlayScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Play — game grid placeholder</Text>
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
  placeholder: {
    fontSize: 18,
    color: "#666",
  },
});
