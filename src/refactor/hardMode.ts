import { ordinal_suffix_of } from "../lib/helpers";
import type { WordPlacement } from "./game";

export function followsHardMode(
  prevGuesses: readonly Word[],
  placements: readonly WordPlacement[],
  testWord: Word
): {
  ok: boolean;
  errorMessage: string;
} {
  // /** Hard mode rules
  //  * 1. all previous 'present' letters must be reused
  //  * 2. all previous 'correct' letters must be correct again
  //  */

  for (let i = 0; i < placements.length; i++) {
    const wordPlacement = placements[i];
    const word = prevGuesses[i];

    for (let j = 0; j < wordPlacement.length; j++) {
      const letter = word[j];
      const letterPlacement = wordPlacement[j];

      if (letterPlacement === "correct" && testWord[j] !== letter) {
        const errorMessage = `${ordinal_suffix_of(
          j + 1
        )} letter must be ${letter}`;
        return { ok: false, errorMessage: errorMessage };
      }
      if (letterPlacement === "present" && !testWord.includes(letter)) {
        const errorMessage = "guess must contain " + letter;
        return { ok: false, errorMessage: errorMessage };
      }
    }
  }

  return {
    ok: true,
    errorMessage: "",
  };
}
