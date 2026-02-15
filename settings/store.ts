/**
 * Settings persistence. Load/save UserSettings to AsyncStorage.
 * Defaults used when no saved settings exist.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserSettings } from "../game-engine/types";
import {
  DEFAULT_DIFFICULTY,
  DEFAULT_DISPLAY_NAME,
  DEFAULT_MY_COLOR,
  DEFAULT_OPPONENT1_COLOR,
} from "../constants";

const SETTINGS_KEY = "@family-game-night/settings";

const defaultSettings: UserSettings = {
  difficulty: DEFAULT_DIFFICULTY,
  displayName: DEFAULT_DISPLAY_NAME,
  myColor: DEFAULT_MY_COLOR,
  opponent1Color: DEFAULT_OPPONENT1_COLOR,
};

export async function loadSettings(): Promise<UserSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw == null) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      difficulty: typeof parsed.difficulty === "number" ? parsed.difficulty : defaultSettings.difficulty,
      displayName: typeof parsed.displayName === "string" ? parsed.displayName : defaultSettings.displayName,
      myColor: typeof parsed.myColor === "string" ? parsed.myColor : defaultSettings.myColor,
      opponent1Color: typeof parsed.opponent1Color === "string" ? parsed.opponent1Color : defaultSettings.opponent1Color,
    };
  } catch {
    return { ...defaultSettings };
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Persist failure: caller can show UI if needed
  }
}
