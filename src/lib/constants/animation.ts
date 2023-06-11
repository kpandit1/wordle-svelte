import { WORD_LENGTH } from "./gameConstants";

export const ANIMATION_DELAY_MS: number = 250;
export const CELL_ANIMATION_DURATION_MS: number = 650;

export const TOTAL_ANIMATION_DURATION: number =
  (WORD_LENGTH - 1) * ANIMATION_DELAY_MS + CELL_ANIMATION_DURATION_MS;
