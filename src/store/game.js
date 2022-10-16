import { get, writable, derived } from "svelte/store";
import { getLetterType } from "../../lib/helpers";
import { GAME_STATES, solution, NUM_GUESSES } from "../../lib/constants";

function getStoredGuesses() {
  return JSON.parse(localStorage.getItem("guesses")) || [];
}

export const guesses = writable(getStoredGuesses());

guesses.subscribe((val) => {
  localStorage.setItem("guesses", JSON.stringify(val));
});

export const gameState = derived(guesses, ($guesses) => {
  if ($guesses.includes(solution)) {
    return GAME_STATES.WON;
  } else if ($guesses.length === NUM_GUESSES) {
    return GAME_STATES.LOST;
  } else {
    return GAME_STATES.IN_PROGRESS;
  }
});

export const currentGuess = writable("");

export const guessNextWord = (word) => {
  guesses.update((prevGuesses) => [...prevGuesses, word]);
};

export const clearState = () => {
  guesses.set([]);
};

export const submitGuess = () => {
  // submit guess and return feedback of the game state - whether won, lost or still going

  guesses.update((prevGuesses) => [...prevGuesses, get(currentGuess)]);
  currentGuess.set("");

  return get(gameState);
};

// returns [status: boolean, errorMessage: string]
export const followsHardMode = (currGuess) => {
  // if hard mode, there are 2 rules
  // all previous 'present' letters must be reused
  // all previous 'correct' letters must be correct again

  // get all previous 'present' and 'found' letters
  let presentLetters = new Set();
  let correctLetters = [];

  get(guesses).forEach((guess) => {
    guess.split("").forEach((letter, i) => {
      if (getLetterType(solution, currGuess, letter, i) === "present") {
        presentLetters.add(letter);
      } else if (getLetterType(solution, currGuess, letter, i) === "correct") {
        correctLetters.push({ letter: letter, idx: i });
      }
    });
  });

  // check if all previous 'correct' letters are correct
  for (let i = 0; i < correctLetters.length; i++) {
    const l = correctLetters[i];
    if (currGuess[l.idx] !== l.letter) {
      // TODO: fix the number suffix (1st, 2nd, 3rd)
      const errorMessage = l.idx + 1 + "th letter must be " + l.letter;
      return [false, errorMessage];
    }
  }

  // check all previously 'present' letters are used in the current guess
  for (const letter of presentLetters) {
    if (!currGuess.includes(letter)) {
      const errorMessage = "guess must contain " + letter;
      return [false, errorMessage];
    }
  }
  return [true, ""];
};
