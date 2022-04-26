import { ALL_WORDS, SOLUTIONS } from "./constants";

export function isValidWord(input) {
  // needs to be a 5 letter word
  if (input.length !== 5) {
    return false;
  }

  // needs to be a word
  return [...ALL_WORDS, ...SOLUTIONS].includes(input.toLowerCase());
}
export function getLetterType(solution, guess, letter, index) {
  // todo - update for multiple letter shenanigans
  if (solution[index] === letter) {
    return "correct";
  }

  const x = countLetterOccurences(solution, letter, guess);
  const y = countLetterOccurences(guess.slice(0, index), letter, solution);

  if (y < x) {
    return "present";
  }
  return "absent";
}

// count number of occurences of letter in word that haven't been matched yet
function countLetterOccurences(word, letter, other) {
  // const count = word
  //   .split("")
  //   .filter((l, i) => l === letter && other[i] !== letter).length;
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter && other[i] !== letter) {
      count += 1;
    }
  }
  return count;
}
