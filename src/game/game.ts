import { writable, type Subscriber } from "svelte/store";
import { followsHardMode } from "./hardMode";
import * as consts from "./gameConstants";
import { isValidWord } from "./validWord";
import { getWordPlacements } from "./placements";

export type GuessSubmitFeedback =
  | {
      isValid: true;
      solution?: string;
    }
  | {
      isValid: false;
      error?: string;
    };

export type Word = string;
export type GameStatus = "in_progress" | "win" | "lose" | "not_started";
export type LetterPlacement = "not_guessed" | "correct" | "present" | "absent";
export type WordPlacement = LetterPlacement[];

export interface GameInterface {
  readonly guesses: ReadonlyArray<Word>;
  readonly placements: ReadonlyArray<WordPlacement>;
  readonly status: GameStatus;
  submitGuess(word: Word): GuessSubmitFeedback;
  reset(): void;
}

export default class Game implements GameInterface {
  private readonly solution: Word;
  private isHardMode: boolean;
  private store = writable(this);
  private _guesses: Word[] = [];

  constructor(solution: string, initGuesses: Word[] = [], isHardMode = false) {
    this.solution = solution;
    this._guesses = initGuesses;
    this.isHardMode = isHardMode;
  }

  get guesses(): Word[] {
    return this._guesses.slice();
  }

  get placements(): ReadonlyArray<WordPlacement> {
    return this._guesses.map((guess) =>
      getWordPlacements(this.solution, guess)
    );
  }

  get status(): Readonly<GameStatus> {
    if (this._guesses.length === 0) {
      return "not_started";
    } else if (this._guesses.includes(this.solution)) {
      return "win";
    } else if (this.guesses.length === consts.MAX_NUM_GUESSES) {
      return "lose";
    }
    return "in_progress";
  }

  subscribe(subscriber: Subscriber<this>) {
    return this.store.subscribe(subscriber);
  }

  reset(): void {
    this._guesses = [];
    this.store.set(this);
  }

  submitGuess(word: string): GuessSubmitFeedback {
    if (this._guesses.length === consts.MAX_NUM_GUESSES) {
      return {
        isValid: false,
        error: "Exceeding upper guess limit",
      };
    }

    if (!isValidWord(word)) {
      return {
        isValid: false,
        error: "Not in word list",
      };
    }
    if (this.isHardMode) {
      const { ok, errorMessage } = followsHardMode(
        this._guesses,
        this.placements,
        word
      );
      if (!ok) {
        return {
          isValid: false,
          error: errorMessage,
        };
      }
    }
    // After all validity checks pass
    this._guesses = [...this._guesses, word];
    this.store.set(this);

    return {
      isValid: true,
      solution: this.status === "in_progress" ? undefined : this.solution,
    };
  }

  setHardModeStatus(value: boolean) {
    if (this.status === "not_started") {
      this.isHardMode = value;
    }
  }
}
