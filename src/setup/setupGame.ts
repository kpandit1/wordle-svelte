import Game from "../game/game";
import { get } from "svelte/store";
import {
  getStoredGuesses,
  getStoredSolution,
  storeGuesses,
  storeSolution,
} from "./storage";
import { SOLUTIONS } from "./solutions";
import settingsStore from "../settings";
// import { currentDayIndex } from "../currentDayIndex";

function isNewGame(solution: string): boolean {
  const prevSolution = getStoredSolution();
  if (!prevSolution || solution !== prevSolution) {
    return true;
  }
  return false;
}

function generateSolution(solutionIdx: number): Word {
  // const solutionIdx = currentDayIndex;
  return SOLUTIONS[solutionIdx];
}

/**
 * Instantiate a game, and connect the game state to storage
 * @returns A set up new game
 */
export default function setupGame(solutionIndex: number): Game {
  const settings = get(settingsStore);

  const sol = generateSolution(solutionIndex);
  const storedGuesses = getStoredGuesses();
  let guesses = storedGuesses;

  if (isNewGame(sol)) {
    storeSolution(sol);
    guesses = [];
  }

  const game = new Game(sol, guesses, settings.hardMode);

  game.subscribe((val) => {
    const guesses = val.guesses;
    storeGuesses(guesses);
  });

  return game;
}
