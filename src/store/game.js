import { get, writable } from "svelte/store";
import { getLetterType } from "../../lib/helpers";
import { solution } from "../../lib/constants";

function getStoredGuesses() {
  return JSON.parse(localStorage.getItem("guesses")) || [];
}

export const guesses = writable(getStoredGuesses());

guesses.subscribe((val) =>
  localStorage.setItem("guesses", JSON.stringify(val))
);

export const currentGuess = writable("");

export const guessNextWord = (word) => {
  guesses.update((prevGuesses) => [...prevGuesses, word]);
};

export const clearState = () => {
  guesses.set([]);
};

export const submitGuess = () => {
  guesses.update((prevGuesses) => [...prevGuesses, get(currentGuess)]);
  currentGuess.set("");
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
