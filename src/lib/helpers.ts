import { SOLUTIONS } from "./constants/solutions";
import { ALL_WORDS } from "./constants/allWords";

export function isValidWord(input: Word): boolean {
  // needs to be a 5 letter word
  if (input.length !== 5) {
    return false;
  }

  // needs to be a word
  return [...ALL_WORDS, ...SOLUTIONS].includes(input.toLowerCase());
}

function treatAsUTC(date: Date) {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
}

export function daysBetween(startDate: Date, endDate: Date) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) /
      millisecondsPerDay
  );
}

export function getKeyColor(
  letter: string,
  solution: Word,
  guesses: Word[]
): LetterPlacement {
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
  return "not_guessed";
}

export function ordinal_suffix_of(i: number): string {
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
