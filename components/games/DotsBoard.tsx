import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import type { DotsState, Player } from "../../game-engine/types";
import { GAME_DRAW_ANIMATION_MS } from "../../constants";

interface DotsBoardProps {
  state: DotsState;
  players: Player[];
  colors: [string, string];
  onDrawLine: (edgeKey: string) => void;
  disabled?: boolean;
}

const DOT_SIZE = 8;
const GAP = 24;

export function DotsBoard({
  state,
  players,
  colors,
  onDrawLine,
  disabled,
}: DotsBoardProps) {
  const { rows, cols, lines, boxes } = state;
  const lineSet = new Set(lines);
  const getColor = (playerId: string) => {
    const idx = players.findIndex((p) => p.id === playerId);
    return idx >= 0 ? colors[idx] : "#ccc";
  };

  const [dotsRevealed, setDotsRevealed] = useState(0);
  const dotAnims = useRef<Animated.Value[]>([]);

  const totalDots = rows * cols;
  if (dotAnims.current.length !== totalDots) {
    dotAnims.current = Array.from({ length: totalDots }, () => new Animated.Value(0));
  }

  useEffect(() => {
    const perRow = GAME_DRAW_ANIMATION_MS / rows;
    const anims = dotAnims.current;
    const steps: Animated.CompositeAnimation[] = [];
    for (let r = 0; r < rows; r++) {
      const rowDots = Array.from({ length: cols }, (_, c) => r * cols + c);
      steps.push(
        Animated.parallel(
          rowDots.map((i) =>
            Animated.timing(anims[i], { toValue: 1, duration: perRow * 0.4, useNativeDriver: true })
          )
        )
      );
    }
    Animated.stagger(perRow * 0.6, steps).start(() => setDotsRevealed(totalDots));
  }, [rows, cols]);

  const handleEdge = (r: number, c: number, h: boolean) => {
    const key = `${r},${c},${h ? "h" : "v"}`;
    if (lineSet.has(key) || disabled || dotsRevealed < totalDots) return;
    onDrawLine(key);
  };

  const width = (cols - 1) * GAP + 32;
  const height = (rows - 1) * GAP + 32;

  return (
    <View style={[styles.container, { width, height }]}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const i = r * cols + c;
          const opacity = dotAnims.current[i]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }) ?? 1;

          return (
            <View
              key={`${r}-${c}`}
              style={[styles.cell, { left: c * GAP, top: r * GAP }]}
            >
              <Animated.View style={[styles.dot, { opacity }]} />
              {dotsRevealed >= totalDots && (
                <>
                  {r < rows - 1 && (
                    <Pressable
                      style={[
                        styles.edgeV,
                        lineSet.has(`${r},${c},v`) && styles.edgeDrawn,
                      ]}
                      onPress={() => handleEdge(r, c, false)}
                    />
                  )}
                  {c < cols - 1 && (
                    <Pressable
                      style={[
                        styles.edgeH,
                        lineSet.has(`${r},${c},h`) && styles.edgeDrawn,
                      ]}
                      onPress={() => handleEdge(r, c, true)}
                    />
                  )}
                </>
              )}
            </View>
          );
        })
      )}
      {Object.entries(boxes).map(([key, playerId]) => {
        const [r, c] = key.split(",").map(Number);
        return (
          <View
            key={key}
            style={[
              styles.box,
              {
                left: c * GAP + DOT_SIZE / 2,
                top: r * GAP + DOT_SIZE / 2,
                width: GAP - DOT_SIZE,
                height: GAP - DOT_SIZE,
                backgroundColor: getColor(playerId) + "40",
                borderColor: getColor(playerId),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  cell: { position: "absolute", width: GAP, height: GAP },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#333",
    left: (GAP - DOT_SIZE) / 2,
    top: (GAP - DOT_SIZE) / 2,
  },
  edgeV: {
    position: "absolute",
    width: 4,
    height: GAP,
    left: (GAP - 4) / 2,
    top: DOT_SIZE / 2,
    backgroundColor: "transparent",
  },
  edgeH: {
    position: "absolute",
    width: GAP,
    height: 4,
    left: DOT_SIZE / 2,
    top: (GAP - 4) / 2,
    backgroundColor: "transparent",
  },
  edgeDrawn: { backgroundColor: "#333" },
  box: { position: "absolute", borderWidth: 2 },
});
