import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { loadSettings, saveSettings } from "../settings/store";
import type { UserSettings } from "../game-engine/types";
import { ColorPicker } from "../components/ColorPicker";

const DIFFICULTY_MIN = 1;
const DIFFICULTY_MAX = 10;

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [difficulty, setDifficulty] = useState(5);
  const [myColor, setMyColor] = useState("#00AEEF");
  const [opponent1Color, setOpponent1Color] = useState("#ED1C24");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setDisplayName(s.displayName);
      setDifficulty(s.difficulty);
      setMyColor(s.myColor);
      setOpponent1Color(s.opponent1Color);
    });
  }, []);

  const handleSave = async () => {
    const next: UserSettings = {
      difficulty,
      displayName: displayName.trim() || "Player 1",
      myColor,
      opponent1Color,
    };
    await saveSettings(next);
    setSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (settings == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Loading settings…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Difficulty (1–10)</Text>
      <View style={styles.difficultyRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <Pressable
            key={n}
            style={[styles.difficultyBtn, difficulty === n && styles.difficultyBtnSelected]}
            onPress={() => setDifficulty(n)}
          >
            <Text style={difficulty === n ? styles.difficultyBtnTextSelected : styles.difficultyBtnText}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Display name</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Player 1"
        autoCapitalize="words"
      />

      <ColorPicker label="My color" value={myColor} onSelect={setMyColor} />
      <ColorPicker label="Opponent 1 color" value={opponent1Color} onSelect={setOpponent1Color} />

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{saved ? "Saved!" : "Save"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  placeholder: { fontSize: 18, color: "#666" },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  difficultyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  difficultyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyBtnSelected: { backgroundColor: "#007AFF" },
  difficultyBtnText: { fontSize: 16 },
  difficultyBtnTextSelected: { fontSize: 16, color: "#fff", fontWeight: "600" },
  saveBtn: {
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
