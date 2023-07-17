import { writable, type Subscriber } from "svelte/store";
import { getWordPlacementsHelper } from "../domain/placements";
import { isValidWord } from "../lib/helpers";
import { followsHardMode } from "./hardMode";
import { MAX_NUM_GUESSES } from "../lib/constants";

export type GuessSubmitFeedback = {
  valid: boolean;
  error?: string;
  solution?: string;
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
  clearGuesses(): void;
}

export default class Game implements GameInterface {
  private solution: Word;
  private isHardMode: boolean;
  private store = writable(this);
  private _guesses: Word[] = [];

  status: GameStatus = "not_started";

  constructor(solution: string, isHardMode = false) {
    this.solution = solution;
    this.isHardMode = isHardMode;
  }

  get guesses(): ReadonlyArray<Word> {
    return this._guesses.slice();
  }

  get placements(): ReadonlyArray<WordPlacement> {
    return this._guesses.map((guess) =>
      getWordPlacementsHelper(this.solution, guess)
    );
  }

  subscribe(subscriber: Subscriber<this>) {
    return this.store.subscribe(subscriber);
  }

  clearGuesses(): void {
    this._guesses = [];
    this.status = "not_started";
  }

  private updateStatus(): void {
    if (this._guesses.includes(this.solution)) {
      this.status = "win";
    } else if (this._guesses.length === MAX_NUM_GUESSES) {
      this.status = "lose";
    } else {
      this.status = "in_progress";
    }
  }

  submitGuess(word: string): GuessSubmitFeedback {
    if (!isValidWord(word)) {
      return {
        valid: false,
        error: "Not in word list",
      };
    }
    if (this.isHardMode) {
      const { ok, errorMessage } = followsHardMode(
        this._guesses,
        word,
        this.solution
      );
      if (!ok) {
        return {
          valid: false,
          error: errorMessage,
        };
      }
    }
    this._guesses = [...this._guesses, word];
    this.updateStatus();
    this.store.set(this);

    return {
      valid: true,
      solution: this.status === "in_progress" ? undefined : this.solution,
    };
  }

  setIsHardMode(value: boolean) {
    if (this.status === "not_started") {
      this.isHardMode = value;
    }
  }
}
