import { getLetterPlacement } from "../domain/placements";
import { ordinal_suffix_of } from "../lib/helpers";

export function followsHardMode(
  prevGuesses: Word[],
  testWord: Word,
  solution: Word
) {
  // if hard mode, there are 2 rules
  // all previous 'present' letters must be reused
  // all previous 'correct' letters must be correct again

  // get all previous 'present' and 'found' letters
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
}
