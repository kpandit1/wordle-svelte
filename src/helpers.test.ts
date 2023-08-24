import { isValidWord } from "./validWord";
import { getWordPlacements } from "./placements";
import { expect, test } from "vitest";

// For convenience
const c: LetterPlacement = "correct";
const p: LetterPlacement = "present";
const a: LetterPlacement = "absent";

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
  expect(getWordPlacements("roast", "roast")).toEqual([c, c, c, c, c]);

  // no letters in common
  expect(getWordPlacements("cline", "roast")).toEqual([a, a, a, a, a]);

  // one correct letter in incorrect spot
  expect(getWordPlacements("crumb", "roast")).toEqual([p, a, a, a, a]);
  expect(getWordPlacements("crumb", "tacks")).toEqual([a, a, p, a, a]);

  // test a word with multiple letter results
  expect(getWordPlacements("roast", "slate")).toEqual([p, a, c, p, a]);
});

test("multiple letter colors", () => {
  // two of the same correct letter
  expect(getWordPlacements("crumb", "crack")).toEqual([c, c, a, a, a]);

  // three of the same correct letter
  expect(getWordPlacements("pumps", "puppy")).toEqual([c, c, a, c, a]);

  // repeat letter in solution
  expect(getWordPlacements("stars", "tsars")).toEqual([p, p, c, c, c]);

  expect(getWordPlacements("stars", "tsars")).toEqual([p, p, c, c, c]);

  expect(getWordPlacements("booky", "outdo")).toEqual([p, a, a, a, p]);
  expect(getWordPlacements("broke", "outdo")).toEqual([p, a, a, a, a]);

  expect(getWordPlacements("sears", "costs")).toEqual([a, a, p, a, c]);
});
