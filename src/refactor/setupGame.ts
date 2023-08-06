import Game from "./game";
import {
  getStoredGuesses,
  getStoredSolution,
  storeGuesses,
  storeSolution,
} from "./api/gameApi";
import { numDaysBetween } from "./common/daysBetween";
import { SOLUTIONS } from "../lib/constants";

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

export function setupGame(isHardMode: boolean): Game {
  const sol = generateSolution();
  const storedGuesses = getStoredGuesses();
  let game: Game;

  if (isNewGame(sol)) {
    storeSolution(sol);
    game = new Game(sol, [], isHardMode);
  } else {
    game = new Game(sol, storedGuesses, isHardMode);
  }

  game.subscribe((val) => {
    const guesses = val.guesses as string[];
    storeGuesses(guesses);
  });

  return game;
}
