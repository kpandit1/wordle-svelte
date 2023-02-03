import { derived, get, writable, type Readable } from "svelte/store";
import { dayNumber, NUM_GUESSES, SOLUTIONS } from "../../lib/constants";
import { getKeyColor, ordinal_suffix_of } from "../../lib/helpers";
import { GameStatus, LETTER_PLACEMENT } from "../global-enums";

// use the day number to get the solution for the day
const actualSolution = SOLUTIONS[dayNumber];

//  const devSolution = "slate";
const devSolution = SOLUTIONS[dayNumber];

// eslint-disable-next-line no-undef
const solution =
  import.meta.env.MODE === "production" ? actualSolution : devSolution;

// for functionality testing
export function getWordPlacementsHelper(
  solution: Word,
  guess: Word
): LETTER_PLACEMENT[] {
  return guess
    .split("")
    .map((letter, index) => getLetterPlacement(solution, guess, index));
}

function getLetterPlacement(
  solution: Word,
  guess: Word,
  index: number
): LETTER_PLACEMENT {
  const letter = guess[index];

  if (solution[index] === letter) {
    return LETTER_PLACEMENT.CORRECT;
  }

  const x = countLetterOccurences(solution, guess, letter);
  const y = countLetterOccurences(guess.slice(0, index), solution, letter);

  if (y < x) {
    return LETTER_PLACEMENT.PRESENT;
  }
  return LETTER_PLACEMENT.ABSENT;
}

// count number of occurences of letter in word that haven't been matched yet
function countLetterOccurences(
  word1: Word,
  word2: Word,
  letter: string
): number {
  // const count = word
  //   .split("")
  //   .filter((l, i) => l === letter && other[i] !== letter).length;
  let count = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === letter && word2[i] !== letter) {
      count += 1;
    }
  }
  return count;
}

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

// Reactive variables
export const guesses = writable(getStoredGuesses());
guesses.subscribe((val) => {
  localStorage.setItem("guesses", JSON.stringify(val));
});

export const guessPlacements = derived(guesses, ($guesses) =>
  $guesses.map((guess) => getWordPlacementsHelper(solution, guess))
);

export const gameStatus = derived(guesses, ($guesses) => {
  if ($guesses.includes(solution)) {
    return GameStatus.WON;
  } else if ($guesses.length === NUM_GUESSES) {
    return GameStatus.LOST;
  } else {
    return GameStatus.IN_PROGRESS;
  }
});
// End reactive variables

// Functions
export function clearState(): void {
  guesses.set([]);
}

// TODO: return solution if game is over {status: GameStatus, }
// TODO: add check for isValidWord
export const submitGuess = (word: Word): GameStatus => {
  // submit guess and return feedback of the game state - whether won, lost or still going
  guesses.update((prevGuesses) => [...prevGuesses, word]);
  return get(gameStatus);
};

type HardModeRes = {
  ok: boolean;
  errorMessage: string;
};

export function followsHardMode(
  prevGuesses: Word[],
  testWord: Word
): HardModeRes {
  // if hard mode, there are 2 rules
  // all previous 'present' letters must be reused
  // all previous 'correct' letters must be correct again

  // get all previous 'present' and 'found' letters
  let presentLetters = new Set<string>();

  let correctLetters = [];

  prevGuesses.forEach((guess) => {
    guess.split("").forEach((letter, i) => {
      if (
        getLetterPlacement(solution, testWord, i) === LETTER_PLACEMENT.PRESENT
      ) {
        presentLetters.add(letter);
      } else if (
        getLetterPlacement(solution, testWord, i) === LETTER_PLACEMENT.CORRECT
      ) {
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

export const keyboardLetterPlacements = derived(guesses, ($guesses) => {
  // Use this till everything's in TS
  function transformKeyColorToEnum(
    c: "correct" | "present" | "absent" | "not-guessed"
  ) {
    if (c === "correct") {
      return LETTER_PLACEMENT.CORRECT;
    } else if (c == "present") {
      return LETTER_PLACEMENT.PRESENT;
    } else if (c === "absent") {
      return LETTER_PLACEMENT.ABSENT;
    } else {
      return LETTER_PLACEMENT.NOT_GUESSED;
    }
  }

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  return letters.reduce(
    (acc, letter) => ({
      ...acc,
      [letter]: transformKeyColorToEnum(
        getKeyColor(letter, solution, $guesses)
      ),
    }),
    {}
  );
});
