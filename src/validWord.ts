import { ALL_WORDS } from "./allWords";
import { SOLUTIONS } from "./solutions";

export function isValidWord(input: Word): boolean {
  return [...ALL_WORDS, ...SOLUTIONS].includes(input.toLowerCase());
}
