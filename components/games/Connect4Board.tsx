import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import Svg, { Rect, Circle } from "react-native-svg";
import type { Connect4State, Player } from "../../game-engine/types";
import { GAME_DRAW_ANIMATION_MS } from "../../constants";

interface Connect4BoardProps {
  state: Connect4State;
  players: Player[];
  colors: [string, string];
  onDrop: (col: number) => void;
  disabled?: boolean;
}

const HOLE_R = 14;
const PADDING = 6;
const SLOT_GAP = 4;

export function Connect4Board({
  state,
  players,
  colors,
  onDrop,
  disabled,
}: Connect4BoardProps) {
  const { rows, cols, columns } = state;
  const getColor = (playerId: string | null) => {
    if (playerId == null) return "#e0e0e0";
    const idx = players.findIndex((p) => p.id === playerId);
    return idx >= 0 ? colors[idx] : "#888";
  };

  const [drawPhase, setDrawPhase] = useState<"rect" | "holes" | "fill" | "done">("rect");
  const rectProgress = useRef(new Animated.Value(0)).current;
  const holesProgress = useRef(new Animated.Value(0)).current;
  const fillProgress = useRef(new Animated.Value(0)).current;

  const third = GAME_DRAW_ANIMATION_MS / 3;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(rectProgress, { toValue: 1, duration: third, useNativeDriver: false }),
      Animated.timing(holesProgress, { toValue: 1, duration: third, useNativeDriver: false }),
      Animated.timing(fillProgress, { toValue: 1, duration: third, useNativeDriver: false }),
    ]).start(() => setDrawPhase("done"));
  }, []);

  const slotW = HOLE_R * 2 + SLOT_GAP;
  const slotH = HOLE_R * 2 + SLOT_GAP;
  const boardW = cols * slotW + PADDING * 2;
  const boardH = rows * slotH + PADDING * 2;

  const fillWidth = fillProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, boardW],
  });

  const canInteract = drawPhase === "done" && !disabled;

  return (
    <View style={styles.container}>
      <View style={[styles.buttons, { width: boardW }]}>
        {Array.from({ length: cols }).map((_, c) => (
          <Pressable
            key={c}
            style={[styles.colBtn, { width: slotW }]}
            onPress={() =>
              canInteract && columns[c].some((x) => x == null) && onDrop(c)
            }
          >
            <Text style={styles.colBtnText}>↓</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.boardWrapper, { width: boardW, height: boardH }]}>
        {/* 3. Grey fill sweeps in from left (behind holes) */}
        <Animated.View
          style={[
            styles.fillOverlay,
            {
              width: fillWidth,
              height: boardH,
              backgroundColor: "#9ca3af",
              opacity: 0.95,
            },
          ]}
        />
        {/* 1–2. Board frame + holes */}
        <Svg width={boardW} height={boardH} style={StyleSheet.absoluteFill}>
          <AnimatedRect
            x={2}
            y={2}
            width={boardW - 4}
            height={boardH - 4}
            rx={8}
            ry={8}
            fill="transparent"
            stroke="#1e40af"
            strokeWidth={4}
            opacity={rectProgress}
          />
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const cx = PADDING + c * slotW + slotW / 2;
              const cy = PADDING + r * slotH + slotH / 2;
              const holeRevealed = holesProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              });
              return (
                <AnimatedCircle
                  key={`${r}-${c}`}
                  cx={cx}
                  cy={cy}
                  r={HOLE_R}
                  fill="#374151"
                  opacity={holeRevealed}
                />
              );
            })
          )}
        </Svg>

        {/* Tokens (colored circles in holes) */}
        <View style={[styles.tokens, { width: boardW, height: boardH }]} pointerEvents="none">
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const cell = columns[c][rows - 1 - r];
              if (cell == null) return null;
              const x = PADDING + c * slotW + slotW / 2;
              const y = PADDING + r * slotH + slotH / 2;
              return (
                <View
                  key={`t-${r}-${c}`}
                  style={[
                    styles.token,
                    {
                      left: x - HOLE_R,
                      top: y - HOLE_R,
                      width: HOLE_R * 2,
                      height: HOLE_R * 2,
                      borderRadius: HOLE_R,
                      backgroundColor: getColor(cell),
                    },
                  ]}
                />
              );
            })
          )}
        </View>
      </View>
    </View>
  );
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  buttons: { flexDirection: "row", marginBottom: 8 },
  colBtn: {
    height: 28,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  colBtnText: { color: "#fff", fontSize: 18 },
  boardWrapper: { position: "relative", overflow: "hidden", borderRadius: 8 },
  fillOverlay: { position: "absolute", left: 0, top: 0 },
  tokens: { position: "absolute", left: 0, top: 0 },
  token: { position: "absolute" },
});
