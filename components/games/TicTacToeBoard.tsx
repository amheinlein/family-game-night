import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import Svg, { Line, Circle, G } from "react-native-svg";
import type { TicTacToeState, Player } from "../../game-engine/types";
import { GAME_DRAW_ANIMATION_MS } from "../../constants";

interface TicTacToeBoardProps {
  state: TicTacToeState;
  players: Player[];
  colors: [string, string];
  onPlace: (row: number, col: number) => void;
  disabled?: boolean;
}

const CELL = 72;
const GRID = CELL * 3;
const STROKE = 2;

export function TicTacToeBoard({
  state,
  players,
  colors,
  onPlace,
  disabled,
}: TicTacToeBoardProps) {
  const board = state.board;
  const getPlayerIndex = (playerId: string | null): number =>
    playerId == null ? -1 : players.findIndex((p) => p.id === playerId);

  const [gridDrawn, setGridDrawn] = useState(false);
  const v1Anim = useRef(new Animated.Value(0)).current;
  const v2Anim = useRef(new Animated.Value(0)).current;
  const h1Anim = useRef(new Animated.Value(0)).current;
  const h2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const lineLen = GRID;
    const quarter = GAME_DRAW_ANIMATION_MS / 4;
    const anim = (val: Animated.Value) =>
      Animated.timing(val, { toValue: 1, duration: quarter, useNativeDriver: false });
    Animated.sequence([
      anim(v1Anim),
      anim(v2Anim),
      anim(h1Anim),
      anim(h2Anim),
    ]).start(() => setGridDrawn(true));
  }, []);

  const lines = [
    { anim: v1Anim, x1: CELL, y1: 0, x2: CELL, y2: GRID, len: GRID },
    { anim: v2Anim, x1: CELL * 2, y1: 0, x2: CELL * 2, y2: GRID, len: GRID },
    { anim: h1Anim, x1: 0, y1: CELL, x2: GRID, y2: CELL, len: GRID },
    { anim: h2Anim, x1: 0, y1: CELL * 2, x2: GRID, y2: CELL * 2, len: GRID },
  ];

  return (
    <View style={styles.container}>
      <Svg width={GRID + STROKE} height={GRID + STROKE}>
        {lines.map((l, i) => (
          <AnimatedLine
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            len={l.len}
            anim={l.anim}
            stroke="#333"
            strokeWidth={STROKE}
          />
        ))}
      </Svg>
      {gridDrawn &&
        [0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const cell = board[row][col];
            const playerIndex = getPlayerIndex(cell);
            const isX = playerIndex === 0;
            const color = playerIndex >= 0 ? colors[playerIndex] ?? "#000" : "#000";

            return (
              <Pressable
                key={`${row}-${col}`}
                style={[styles.cell, { left: col * CELL, top: row * CELL }]}
                onPress={() => !disabled && cell == null && onPlace(row, col)}
              >
                {cell != null && playerIndex >= 0 &&
                  (isX ? (
                    <AnimatedX color={color} />
                  ) : (
                    <AnimatedO color={color} />
                  ))}
              </Pressable>
            );
          })
        )}
    </View>
  );
}

function AnimatedLine({
  x1, y1, x2, y2, len, anim, stroke, strokeWidth,
}: {
  x1: number; y1: number; x2: number; y2: number;
  len: number; anim: Animated.Value; stroke: string; strokeWidth: number;
}) {
  const dashOffset = anim.interpolate({ inputRange: [0, 1], outputRange: [len, 0] });
  return (
    <AnimatedSvgLine
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={len}
      strokeDashoffset={dashOffset}
    />
  );
}

const AnimatedSvgLine = Animated.createAnimatedComponent(Line);

function AnimatedX({ color }: { color: string }) {
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const d = 180;
    Animated.sequence([
      Animated.timing(progress1, { toValue: 1, duration: d, useNativeDriver: false }),
      Animated.timing(progress2, { toValue: 1, duration: d, useNativeDriver: false }),
    ]).start();
  }, []);

  const size = CELL - 16;
  const cx = CELL / 2;
  const cy = CELL / 2;
  const r = size / 2;
  const diag = Math.sqrt(2) * r;

  const dash1 = progress1.interpolate({ inputRange: [0, 1], outputRange: [diag, 0] });
  const dash2 = progress2.interpolate({ inputRange: [0, 1], outputRange: [diag, 0] });

  return (
    <Svg width={CELL} height={CELL} style={styles.marker}>
      <AnimatedSvgLine
        x1={cx - r}
        y1={cy - r}
        x2={cx + r}
        y2={cy + r}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={diag}
        strokeDashoffset={dash1}
      />
      <AnimatedSvgLine
        x1={cx + r}
        y1={cy - r}
        x2={cx - r}
        y2={cy + r}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={diag}
        strokeDashoffset={dash2}
      />
    </Svg>
  );
}

function AnimatedO({ color }: { color: string }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 280, useNativeDriver: false }).start();
  }, []);

  const r = (CELL - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const cx = CELL / 2;
  const cy = CELL / 2;
  return (
    <Svg width={CELL} height={CELL} style={styles.marker}>
      <G transform={`rotate(-90 ${cx} ${cy})`}>
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: { padding: 16, position: "relative", width: GRID, height: GRID },
  cell: {
    position: "absolute",
    width: CELL,
    height: CELL,
    justifyContent: "center",
    alignItems: "center",
  },
  marker: { position: "absolute" },
});
