/**
 * App-wide constants (dev-facing, not user-configurable).
 * Draw animation duration, Crayola 8 colors, defaults per docs/roadmap.md step 1.3.
 */

export const GAME_DRAW_ANIMATION_MS = 2000;

/** Crayola 8 basic colors (hex). */
export const CRAYOLA_8_COLORS: string[] = [
  "#ED1C24", // Red
  "#F26522", // Orange
  "#FFF200", // Yellow
  "#00A651", // Green
  "#00AEEF", // Blue
  "#2E3192", // Indigo
  "#662D91", // Violet
  "#EC008C", // Magenta
];

export const DEFAULT_DIFFICULTY = 5;
export const DEFAULT_DISPLAY_NAME = "Player 1";

export const DEFAULT_MY_COLOR = CRAYOLA_8_COLORS[4]; // Blue
export const DEFAULT_OPPONENT1_COLOR = CRAYOLA_8_COLORS[0]; // Red

/** Dots game grid size range. */
export const DOTS_GRID_MIN = 5;
export const DOTS_GRID_MAX = 9;
export const DEFAULT_DOTS_GRID_SIZE = 6;
