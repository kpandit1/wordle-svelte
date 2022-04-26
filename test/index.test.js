import { isValidWord, getLetterType } from "../lib/helpers";

const c = "correct";
const p = "present";
const a = "absent";

function getLetterInfo(word, solution) {
  return word
    .split("")
    .map((letter, index) => getLetterType(solution, word, letter, index));
}

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
  expect(getLetterInfo("roast", "roast")).toEqual([c, c, c, c, c]);

  // no letters in common
  expect(getLetterInfo("roast", "cline")).toEqual([a, a, a, a, a]);

  // one correct letter in incorrect spot
  expect(getLetterInfo("roast", "crumb")).toEqual([p, a, a, a, a]);
  expect(getLetterInfo("tacks", "crumb")).toEqual([a, a, p, a, a]);

  // test a word with multiple letter results
  expect(getLetterInfo("slate", "roast")).toEqual([p, a, c, p, a]);
});

test("multiple letter colors", () => {
  // two of the same correct letter
  expect(getLetterInfo("crack", "crumb")).toEqual([c, c, a, a, a]);

  // three of the same correct letter
  expect(getLetterInfo("puppy", "pumps")).toEqual([c, c, a, c, a]);

  // repeat letter in solution
  expect(getLetterInfo("tsars", "stars")).toEqual([p, p, c, c, c]);

  expect(getLetterInfo("tsars", "stars")).toEqual([p, p, c, c, c]);

  expect(getLetterInfo("outdo", "booky")).toEqual([p, a, a, a, p]);
  expect(getLetterInfo("outdo", "broke")).toEqual([p, a, a, a, a]);

  expect(getLetterInfo("costs", "sears")).toEqual([a, a, p, a, c]);
});
