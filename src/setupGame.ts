import Game from "./game/game";
import { get } from "svelte/store";
import {
  getStoredGuesses,
  getStoredSolution,
  storeGuesses,
  storeSolution,
} from "./api/gameApi";
import { numDaysBetween } from "./common/daysBetween";
import { SOLUTIONS } from "./solutions";
import settingsStore from "./settings";

function isNewGame(solution: string): boolean {
  const prevSolution = getStoredSolution();
  if (!prevSolution || solution !== prevSolution) {
    return true;
  }
  return false;
}

function generateSolution(): Word {
  const solutionIdx = numDaysBetween(new Date(2021, 6, 2), new Date());
  return SOLUTIONS[solutionIdx];
}

/**
 * Instantiate a game, and connect the game state to storage
 * @returns A set up new game
 */
export default function setupGame(): Game {
  const settings = get(settingsStore);

  const sol = generateSolution();
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
