import { getLetterPlacement } from "../domain/placements";
import { ordinal_suffix_of } from "../lib/helpers";

export function followsHardMode(
  prevGuesses: Word[],
  testWord: Word,
  solution: Word
) {
  /** Hard mode rules
   * 1. all previous 'present' letters must be reused
   * 2. all previous 'correct' letters must be correct again
   */
  //  get all previous 'present' and 'correct' letters
  const presentLetters = new Set<string>();
  const correctLetters = [];

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
  } // check all previously 'present' letters are used in the current guess
  for (const letter of presentLetters) {
    if (!testWord.includes(letter)) {
      const errorMessage = "guess must contain " + letter;
      return { ok: false, errorMessage: errorMessage };
    }
  }
  return { ok: true, errorMessage: "" };
}
