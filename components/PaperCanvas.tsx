import { View, StyleSheet, ViewStyle } from "react-native";

type PaperStyle = "lined" | "graph" | "blank";

interface PaperCanvasProps {
  paperStyle: PaperStyle;
  children: React.ReactNode;
  style?: ViewStyle;
}

const PAPER_COLOR = "#faf8f0";

export function PaperCanvas({ paperStyle, children, style }: PaperCanvasProps) {
  return (
    <View style={[styles.base, paperStyle === "graph" && styles.graph, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: PAPER_COLOR,
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
  },
  graph: {
    backgroundColor: PAPER_COLOR,
  },
});
