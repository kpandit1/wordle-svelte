import { daysBetween } from "../helpers";

export const NUM_GUESSES = 6;
export const WORD_LENGTH = 5;

// count the number of days since the start date
export const dayNumber = daysBetween(new Date(2021, 6, 1), new Date());