import { derived, get, writable, type Readable } from "svelte/store";
import { dayNumber, MAX_NUM_GUESSES, SOLUTIONS } from "../lib/constants";
import { getKeyColor, ordinal_suffix_of } from "../lib/helpers";
import { getLetterPlacement, getWordPlacementsHelper } from "./placements";

// use the day number to get the solution for the day
const actualSolution = SOLUTIONS[dayNumber];

const devSolution = SOLUTIONS[dayNumber];

// eslint-disable-next-line no-undef
const solution =
  import.meta.env.MODE === "production" ? actualSolution : devSolution;

function getStoredGuesses(): Word[] {
  const storedGuessesStr = localStorage.getItem("guesses");

  if (!storedGuessesStr) {
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

  const status = get(gameStatus);

  return {
    status,
    // return solution only if game over
    solution: status === "in_progress" ? undefined : solution,
  };
}

export function followsHardMode(
  prevGuesses: Word[],
  testWord: Word
): {
  ok: boolean;
  errorMessage: string;
} {
  // if hard mode, there are 2 rules
  // all previous 'present' letters must be reused
  // all previous 'correct' letters must be correct again

  // get all previous 'present' and 'found' letters
  let presentLetters = new Set<string>();

  let correctLetters = [];

  prevGuesses.forEach((guess) => {
    guess.split("").forEach((letter, i) => {
      if (getLetterPlacement(solution, testWord, i) === "present") {
        presentLetters.add(letter);
      } else if (getLetterPlacement(solution, testWord, i) === "correct") {
        correctLetters.push({ letter: letter, idx: i });
      }
    });
  });

  // check if all previous 'correct' letters are correct
  for (let i = 0; i < correctLetters.length; i++) {
    const l = correctLetters[i];
    if (testWord[l.idx] !== l.letter) {
      const errorMessage =
        ordinal_suffix_of(l.idx + 1) + "th letter must be " + l.letter;
      return { ok: false, errorMessage: errorMessage };
    }
  }

  // check all previously 'present' letters are used in the current guess
  for (const letter of presentLetters) {
    if (!testWord.includes(letter)) {
      const errorMessage = "guess must contain " + letter;
      return { ok: false, errorMessage: errorMessage };
    }
  }
  return { ok: true, errorMessage: "" };
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
