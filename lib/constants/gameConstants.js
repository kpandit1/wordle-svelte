import { daysBetween } from "../helpers";
import { SOLUTIONS } from "./solutions";

export const NUM_GUESSES = 6;
export const WORD_LENGTH = 5;

export const GAME_STATES = {
  IN_PROGRESS: "IN_PROGRESS",
  WON: "WON",
  LOST: "LOST",
};

// count the number of days since the start date
export const dayNumber = daysBetween(new Date(2021, 6, 1), new Date());

// use the day number to get the solution for the day
const actualSolution = SOLUTIONS[dayNumber];

//  const devSolution = "slate";
const devSolution = SOLUTIONS[dayNumber];

// eslint-disable-next-line no-undef
export const solution =
  import.meta.env.MODE === "production" ? actualSolution : devSolution;
