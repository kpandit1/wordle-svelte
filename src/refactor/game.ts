import { writable, type Subscriber } from "svelte/store";
import { getWordPlacementsHelper } from "../domain/placements";
import { isValidWord } from "../lib/helpers";
import { followsHardMode } from "./hardMode";
import { MAX_NUM_GUESSES } from "../lib/constants";

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
  private solution: Word;
  private isHardMode: boolean;
  private store = writable(this);
  private _guesses: Word[] = [];

  constructor(solution: string, initGuesses: Word[] = [], isHardMode = false) {
    this.solution = solution;
    this._guesses = initGuesses;
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

  get status(): Readonly<GameStatus> {
    if (this._guesses.length === 0) {
      return "not_started";
    } else if (this._guesses.includes(this.solution)) {
      return "win";
    } else if (this.guesses.length === MAX_NUM_GUESSES) {
      return "lose";
    }
    return "in_progress";
  }

  subscribe(subscriber: Subscriber<this>) {
    return this.store.subscribe(subscriber);
  }

  reset(): void {
    this._guesses = [];
  }

  submitGuess(word: string): GuessSubmitFeedback {
    if (!isValidWord(word)) {
      return {
        isValid: false,
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
          isValid: false,
          error: errorMessage,
        };
      }
    }
    this._guesses = [...this._guesses, word];
    this.store.set(this);

    return {
      isValid: true,
      solution: this.status === "in_progress" ? undefined : this.solution,
    };
  }

  setIsHardMode(value: boolean) {
    if (this.status === "not_started") {
      this.isHardMode = value;
    }
  }
}
