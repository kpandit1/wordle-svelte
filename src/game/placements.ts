function countLetterOccurences(
  word1: Word,
  word2: Word,
  letter: string
): number {
  let count = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === letter && word2[i] !== letter) {
      count += 1;
    }
  }
  return count;
}

function getLetterPlacement(
  solution: Word,
  guess: Word,
  index: number
): LetterPlacement {
  const letter = guess[index];

  if (solution[index] === letter) {
    return "correct";
  }

  const x = countLetterOccurences(solution, guess, letter);
  const y = countLetterOccurences(guess.slice(0, index), solution, letter);

  if (y < x) {
    return "present";
  }
  return "absent";
}

export function getWordPlacements(
  solution: Word,
  guess: Word
): LetterPlacement[] {
  return guess
    .split("")
    .map((letter, index) => getLetterPlacement(solution, guess, index));
}
