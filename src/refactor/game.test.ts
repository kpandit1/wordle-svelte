import { beforeEach, describe, expect, test } from "vitest";
import type { GameStatus, GameInterface } from "./game";
import Game from "./game";

describe("Game basics", () => {
  let game = new Game("crumb");

  beforeEach(() => {
    game = new Game("crumb");
  });

  test("game should set up correctly", () => {
    const status: GameStatus = "not_started";
    expect(game.status).toBe(status);
    expect(game.guesses).toEqual([]);
    expect(game.placements.length).toBe(0);
  });

  test("submitting a valid guess should add it to guesses", () => {
    expect(game.guesses.length).toBe(0);

    game.submitGuess("roast");
    expect(game.guesses.length).toBe(1);

    game.submitGuess("cline");
    expect(game.guesses.length).toBe(2);

    game.submitGuess("dumps");
    expect(game.guesses.length).toBe(3);

    game.submitGuess("field");
    expect(game.guesses.length).toBe(4);

    game.reset();
    expect(game.guesses.length).toBe(0);
  });

  test("number of letter placements should always match number of guesses", () => {
    expect(game.guesses.length).toBe(0);
    expect(game.placements.length).toBe(0);

    game.submitGuess("roast");
    expect(game.guesses.length).toBe(1);
    expect(game.placements.length).toBe(1);

    game.submitGuess("cline");
    expect(game.guesses.length).toBe(2);
    expect(game.placements.length).toBe(2);

    game.reset();
    expect(game.guesses.length).toBe(0);
    expect(game.placements.length).toBe(0);
  });
});

describe("Letter placements", () => {
  let game: GameInterface;
  const c: LetterPlacement = "correct";
  const a: LetterPlacement = "absent";
  const p: LetterPlacement = "present";

  beforeEach(() => {
    game = new Game("crumb");
  });

  test("basic letter placements should be correct", () => {
    game.submitGuess("roast");
    let placements = game.placements[0];
    expect(placements).toEqual([p, a, a, a, a]);

    game.submitGuess("cline");
    placements = game.placements[1];
    expect(placements).toEqual([c, a, a, a, a]);

    game.submitGuess("dumpy");
    placements = game.placements[2];
    expect(placements).toEqual([a, p, p, a, a]);

    game.submitGuess("crumb");
    placements = game.placements[3];
    expect(placements).toEqual([c, c, c, c, c]);
  });
});

describe("Letter placements", () => {
  let game: GameInterface;
  const c: LetterPlacement = "correct";
  const a: LetterPlacement = "absent";
  const p: LetterPlacement = "present";

  beforeEach(() => {
    game = new Game("crumb");
  });

  test("basic letter placements should be correct", () => {
    game.submitGuess("roast");
    let placements = game.placements[0];
    expect(placements).toEqual([p, a, a, a, a]);

    game.submitGuess("cline");
    placements = game.placements[1];
    expect(placements).toEqual([c, a, a, a, a]);

    game.submitGuess("dumpy");
    placements = game.placements[2];
    expect(placements).toEqual([a, p, p, a, a]);

    game.submitGuess("crumb");
    placements = game.placements[3];
    expect(placements).toEqual([c, c, c, c, c]);
  });
});

describe("Game status", () => {
  let game = new Game("crumb");

  beforeEach(() => {
    game = new Game("crumb");
  });

  test("status should work for won games", () => {
    let status: GameStatus = "not_started";

    expect(game.status).toBe(status);
    game.submitGuess("roast");

    status = "in_progress";
    expect(game.status).toBe(status);

    game.submitGuess("cline");
    expect(game.status).toBe(status);

    game.submitGuess("dunks");
    expect(game.status).toBe(status);

    status = "win";
    game.submitGuess("crumb");
    expect(game.status).toBe(status);
  });

  test("status should work for lost games", () => {
    let status: GameStatus = "not_started";

    expect(game.status).toBe(status);
    game.submitGuess("roast");

    status = "in_progress";
    expect(game.status).toBe(status);

    game.submitGuess("cline");
    expect(game.status).toBe(status);

    game.submitGuess("dunks");
    expect(game.status).toBe(status);

    game.submitGuess("roast");
    game.submitGuess("roast");
    game.submitGuess("roast");

    status = "lose";
    expect(game.status).toBe(status);
  });
});
