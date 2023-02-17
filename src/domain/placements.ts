import { LETTER_PLACEMENT } from "../global-enums";

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

export function getWordPlacementsHelper(
  solution: Word,
  guess: Word
): LETTER_PLACEMENT[] {
  return guess
    .split("")
    .map((letter, index) => getLetterPlacement(solution, guess, index));
}

export function getLetterPlacement(
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
