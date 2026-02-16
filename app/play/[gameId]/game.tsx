import { useEffect, useReducer, useRef, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { GameSession, GameAction } from "../../../game-engine/types";
import { dispatchAction, getCurrentTurn, getWinner, isGameOver } from "../../../game-engine/runner";
import { getGame } from "../../../game-engine/registry";
import { createSession } from "../../../games/sessionFactory";
import { loadSettings } from "../../../settings/store";
import type { UserSettings } from "../../../game-engine/types";
import { TicTacToeBoard } from "../../../components/games/TicTacToeBoard";
import { DotsBoard } from "../../../components/games/DotsBoard";
import { Connect4Board } from "../../../components/games/Connect4Board";
import { PlayerStrip } from "../../../components/PlayerStrip";
import { getPlayerColor } from "../../../settings/colorMapping";
import { useState } from "react";

type SessionAction =
  | { type: "INIT"; payload: GameSession | null }
  | GameAction;

function sessionReducer(session: GameSession | null, action: SessionAction): GameSession | null {
  if (action.type === "INIT") return action.payload;
  if (session == null) return null;
  const next = dispatchAction(session, action);
  return next ?? session;
}

export default function GameScreen() {
  const { gameId, mode } = useLocalSearchParams<{ gameId: string; mode: string }>();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [session, setSession] = useReducer(sessionReducer, null as GameSession | null);
  const gameType = (gameId ?? "tic-tac-toe") as "tic-tac-toe" | "dots" | "connect4";
  const modeVal = (mode ?? "single") as "single" | "singleDevice" | "multiDevice";
  const aiScheduled = useRef(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (!settings) return;
    try {
      const s = createSession(gameType, modeVal, settings);
      setSession({ type: "INIT", payload: s });
    } catch {
      setSession({ type: "INIT", payload: null });
    }
  }, [gameType, modeVal, settings?.displayName, settings?.dotsGridSize]);

  const dispatch = useCallback((action: GameAction) => setSession(action), []);

  useEffect(() => {
    if (session == null || settings == null || session.mode !== "single") return;
    if (isGameOver(session)) return;
    const current = getCurrentTurn(session);
    if (current?.id !== "ai") {
      aiScheduled.current = false;
      return;
    }
    if (aiScheduled.current) return;
    const contract = getGame(session.gameType);
    if (!contract) return;
    const strategy = contract.getAIStrategy(settings.difficulty);
    if (!strategy) return;
    aiScheduled.current = true;
    const t = setTimeout(() => {
      const action = strategy(session.state as never);
      if (action) dispatch(action);
      aiScheduled.current = false;
    }, 500);
    return () => clearTimeout(t);
  }, [session, settings, dispatch]);

  if (session == null || settings == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Loading…</Text>
      </View>
    );
  }

  if (session.gameType !== "tic-tac-toe" && session.gameType !== "dots" && session.gameType !== "connect4") {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Game “{session.gameType}” not implemented yet.</Text>
      </View>
    );
  }

  const currentTurn = getCurrentTurn(session);
  const winner = getWinner(session);
  const over = isGameOver(session);
  // Player 1 == Me: single (vs AI) and singleDevice (pass-and-play) both treat Player 1 as "me"
  const myPlayerId =
    session.mode === "single" || session.mode === "singleDevice"
      ? session.players[0]?.id ?? null
      : null;
  const colors: [string, string] = [
    getPlayerColor(session.players[0], session, myPlayerId, settings),
    getPlayerColor(session.players[1], session, myPlayerId, settings),
  ];

  return (
    <View style={styles.container}>
      <PlayerStrip
        players={session.players}
        session={session}
        settings={settings}
        myPlayerId={myPlayerId}
      />
      <Text style={styles.turn}>
        {over
          ? winner
            ? `Winner: ${winner.displayName}`
            : "Draw"
          : currentTurn
            ? `Turn: ${currentTurn.displayName}`
            : ""}
      </Text>
      {session.gameType === "tic-tac-toe" && (
        <TicTacToeBoard
          state={session.state as import("../../../game-engine/types").TicTacToeState}
          players={session.players}
          colors={colors}
          onPlace={(row, col) => dispatch({ type: "PLACE", row, col })}
          disabled={over || currentTurn?.id === "ai"}
        />
      )}
      {session.gameType === "dots" && (
        <DotsBoard
          state={session.state as import("../../../game-engine/types").DotsState}
          players={session.players}
          colors={colors}
          onDrawLine={(edgeKey) => dispatch({ type: "DRAW_LINE", edgeKey })}
          disabled={over || currentTurn?.id === "ai"}
        />
      )}
      {session.gameType === "connect4" && (
        <Connect4Board
          state={session.state as import("../../../game-engine/types").Connect4State}
          players={session.players}
          colors={colors}
          onDrop={(col) => dispatch({ type: "DROP", col })}
          disabled={over || currentTurn?.id === "ai"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  placeholder: { fontSize: 18, color: "#666" },
  turn: { fontSize: 18, marginBottom: 16, fontWeight: "600" },
});
