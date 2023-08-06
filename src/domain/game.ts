import { derived, get, writable, type Readable } from "svelte/store";
import { dayNumber, MAX_NUM_GUESSES, SOLUTIONS } from "../lib/constants";
import { getKeyColor, ordinal_suffix_of } from "../lib/helpers";
import { getLetterPlacement, getWordPlacementsHelper } from "./placements";
import { getStoredLastPlayedDay, storeLastPlayedDay } from "./usage";
import type { WordPlacement } from "../refactor/game";

// use the day number to get the solution for the day
const actualSolution = SOLUTIONS[dayNumber];
// const devSolution = SOLUTIONS[dayNumber];
const devSolution = "chart";

// eslint-disable-next-line no-undef
const solution =
  import.meta.env.MODE === "production" ? actualSolution : devSolution;

function getStoredGuesses(): Word[] {
  const storedGuessesStr = localStorage.getItem("guesses");
  if (!storedGuessesStr) {
    return [];
  }

  // this ensures that previous guesses are reset between days
  if (getStoredLastPlayedDay() !== dayNumber) {
    return [];
  }

  const parsed = JSON.parse(storedGuessesStr);
  if (Array.isArray(parsed)) {
    return parsed as Word[];
  } else {
    return [];
  }
}

export const guesses = writable(getStoredGuesses());
guesses.subscribe((val) => {
  localStorage.setItem("guesses", JSON.stringify(val));
});

export const guessPlacements = derived(guesses, ($guesses) =>
  $guesses.map((guess) => getWordPlacementsHelper(solution, guess))
);

export const gameStatus: Readable<GameStatus> = derived(guesses, ($guesses) => {
  if ($guesses.includes(solution)) {
    return "win";
  } else if ($guesses.length === MAX_NUM_GUESSES) {
    return "lose";
  } else {
    return "in_progress";
  }
});

export function clearState(): void {
  guesses.set([]);
}

export function submitGuess(word: Word): {
  status: GameStatus;
  solution?: Word;
} {
  // submit guess and return feedback of the game state - whether won, lost or still going
  guesses.update((prevGuesses) => [...prevGuesses, word]);
  storeLastPlayedDay(dayNumber);

  const status = get(gameStatus);

  return {
    status,
    // return solution only if game over
    solution: status === "in_progress" ? undefined : solution,
  };
}

export function followsHardMode(
  prevGuesses: Word[],
  placements: WordPlacement[],
  testWord: Word
): {
  ok: boolean;
  errorMessage: string;
} {
  // /** Hard mode rules
  //  * 1. all previous 'present' letters must be reused
  //  * 2. all previous 'correct' letters must be correct again
  //  */

  for (let i = 0; i < placements.length; i++) {
    const wordPlacement = placements[i];
    const word = prevGuesses[i];

    for (let j = 0; j < wordPlacement.length; j++) {
      const letter = word[j];
      const letterPlacement = wordPlacement[j];

      //  all previous 'present' letters must be reused
      if (letterPlacement === "present" && !testWord.includes(letter)) {
        const errorMessage = "guess must contain " + letter;
        return { ok: false, errorMessage: errorMessage };
      }
      //  all previous 'correct' letters must be correct again
      if (letterPlacement === "correct" && testWord[j] !== letter) {
        const errorMessage =
          ordinal_suffix_of(j + 1) + " letter must be " + letter;
        return { ok: false, errorMessage: errorMessage };
      }
    }
  }

  return {
    ok: true,
    errorMessage: "",
  };
}

export function getKeyboardLetterPlacements(
  guesses: Word[]
): Record<string, LetterPlacement> {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  return letters.reduce(
    (acc, letter) => ({
      ...acc,
      [letter]: getKeyColor(letter, solution, guesses),
    }),
    {}
  );
}
