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

function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

export function daysBetween(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  // TODO: verify floor is correct
  return Math.floor(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
  );
}
export function getKeyColor(letter, solution, guesses) {
  const letterInSolution = solution.includes(letter);
  let letterInGuess = false;

  for (let i = 0; i < guesses.length; i++) {
    for (let j = 0; j < guesses[i].length; j++) {
      if (guesses[i][j] === letter && solution[j] === letter) {
        return "correct";
      }
      if (guesses[i][j] === letter) {
        if (solution[j] === letter) {
          return "correct";
        } else {
          letterInGuess = true;
        }
      }
    }
  }
  if (letterInGuess) {
    if (letterInSolution) {
      return "present";
    }
    return "absent";
  }
  return "not-guessed";
}