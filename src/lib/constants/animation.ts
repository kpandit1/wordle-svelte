import { MAX_NUM_GUESSES } from "./gameConstants";

export const ANIMATION_DELAY_MS: number = 250;
export const CELL_ANIMATION_DURATION_MS: number = 650;

export const TOTAL_ANIMATION_DURATION: number =
  (MAX_NUM_GUESSES - 1) * ANIMATION_DELAY_MS + CELL_ANIMATION_DURATION_MS;
