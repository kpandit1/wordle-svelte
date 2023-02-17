import { isValidWord } from "../lib/helpers.js";
import { getWordPlacementsHelper } from "../src/domain/helpers.js";
import { LETTER_PLACEMENT } from "../src/global-enums.js";
import { expect, test } from "vitest";

const c = LETTER_PLACEMENT.CORRECT;
const p = LETTER_PLACEMENT.PRESENT;
const a = LETTER_PLACEMENT.ABSENT;

test("testing valid words", () => {
  expect(isValidWord("is")).toBe(false);
  expect(isValidWord("mxasw")).toBe(false);

  // uppercase words
  expect(isValidWord("MXASW")).toBe(false);
  expect(isValidWord("ROAST")).toBe(true);

  expect(isValidWord("roast")).toBe(true);
  expect(isValidWord("shame")).toBe(true);
  expect(isValidWord("xylyl")).toBe(true);
  expect(isValidWord("bandana")).toBe(false);
  expect(isValidWord("     ")).toBe(false);
});

test("basic letter colors", () => {
  // same word
  expect(getWordPlacementsHelper("roast", "roast")).toEqual([c, c, c, c, c]);

  // no letters in common
  expect(getWordPlacementsHelper("cline", "roast")).toEqual([a, a, a, a, a]);

  // one correct letter in incorrect spot
  expect(getWordPlacementsHelper("crumb", "roast")).toEqual([p, a, a, a, a]);
  expect(getWordPlacementsHelper("crumb", "tacks")).toEqual([a, a, p, a, a]);

  // test a word with multiple letter results
  expect(getWordPlacementsHelper("roast", "slate")).toEqual([p, a, c, p, a]);
});

test("multiple letter colors", () => {
  // two of the same correct letter
  expect(getWordPlacementsHelper("crumb", "crack")).toEqual([c, c, a, a, a]);

  // three of the same correct letter
  expect(getWordPlacementsHelper("pumps", "puppy")).toEqual([c, c, a, c, a]);

  // repeat letter in solution
  expect(getWordPlacementsHelper("stars", "tsars")).toEqual([p, p, c, c, c]);

  expect(getWordPlacementsHelper("stars", "tsars")).toEqual([p, p, c, c, c]);

  expect(getWordPlacementsHelper("booky", "outdo")).toEqual([p, a, a, a, p]);
  expect(getWordPlacementsHelper("broke", "outdo")).toEqual([p, a, a, a, a]);

  expect(getWordPlacementsHelper("sears", "costs")).toEqual([a, a, p, a, c]);
});
