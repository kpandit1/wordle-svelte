import { ALL_WORDS, SOLUTIONS } from "./constants";

export function isValidWord(input) {
  // needs to be a 5 letter word
  if (input.length !== 5) {
    return false;
  }

  // needs to be a word
  return [...ALL_WORDS, ...SOLUTIONS].includes(input.toLowerCase());
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

export function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
