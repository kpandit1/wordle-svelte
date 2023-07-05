<script lang="ts">
  import { gameStatus } from "./domain/game";
  import {
    followsHardMode,
    guesses,
    submitGuess,
    clearState,
  } from "./domain/game";
  import Guesses from "./Guesses.svelte";
  import Header from "./Header.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toast from "./Toast.svelte";
  import { getKeyboardLetterPlacements } from "./domain/game";
  import toast from "./store/toast";
  import { WORD_LENGTH } from "./lib/constants";
  import { isValidWord } from "./lib/helpers";
  import settings from "./store/settings";
  import { addLoss, addWin } from "./store/stats";

  let currentGuess: Word = "";

  let invalidGuessFeedbackNeeded = false;
  let showWinningAnimation = false;

  let feedback: { status: GameStatus; solution: Word } | null = null;

  let headerRef: any;

  let isTypingPrevented: boolean = $guesses.length > 0;
  const isDev = import.meta.env.MODE === "development";

  function showStatsDialog() {
    headerRef.showStatsDialog();
  }
  function showFeedback() {
    if (!feedback) {
      return;
    }

    if ($gameStatus === "in_progress") {
      isTypingPrevented = false;
    }

    // 1. Update on-screen keyboard letter placements
    keyboardPlacements = getKeyboardLetterPlacements($guesses);

    // 2. Show win/lose feedback
    if (feedback.status === "win") {
      const numGuessesToMessageMap = {
        1: "Genius",
        2: "Magnificent",
        3: "Impressive",
        4: "Splendid",
        5: "Great",
        6: "Phew",
      };
      toast.setToast(numGuessesToMessageMap[$guesses.length]);
      showWinningAnimation = true;
    } else if (feedback.status === "lose") {
      toast.setToast(feedback.solution.toUpperCase(), 7200 * 1000);
    }
    // 3. Show stats dialog if game over
    if (feedback?.status === "lose") {
      const SMALL_PADDING_MS = 500;
      setTimeout(() => {
        showStatsDialog();
      }, SMALL_PADDING_MS);
    }
  }

  function onWin() {
    const SMALL_PADDING_MS = 500;
    setTimeout(() => {
      showStatsDialog();
    }, SMALL_PADDING_MS);
  }
  function onLose() {
    const SMALL_PADDING_MS = 500;
    setTimeout(() => {
      showStatsDialog();
    }, SMALL_PADDING_MS);
  }

  function isGuessValid(guess: Word, prevGuesses: Word[]): boolean {
    if (guess.length < WORD_LENGTH) {
      toast.setToast("Not enough letters");
      return false;
    }
    if (guess === "danby") {
      toast.setToast("😍");
      return true;
    }

    // only consider valid words
    if (!isValidWord(guess)) {
      toast.setToast("Not in word list");
      return false;
    }

    if ($settings.hardMode) {
      const res = followsHardMode(prevGuesses, guess);
      if (res.ok) {
        return true;
      } else {
        toast.setToast(res.errorMessage);
        return false;
      }
    }
    return true;
  }

  // Submit current guess
  function handleSubmit() {
    if (!isGuessValid(currentGuess, $guesses)) {
      invalidGuessFeedbackNeeded = true;
      return;
    }

    isTypingPrevented = true;
    let status: GameStatus = "in_progress";
    let solution: Word | undefined = undefined;
    ({ status, solution } = submitGuess(currentGuess));

    if (status === "win") {
      addWin($guesses.length);
    } else if (status === "lose") {
      addLoss();
    }
    // Reset guess
    currentGuess = "";

    feedback = { status, solution };
  }

  let keyboardPlacements = getKeyboardLetterPlacements($guesses);
</script>

<Header bind:this={headerRef} />
<div id="game">
  <Toast />
  <Guesses
    {currentGuess}
    {invalidGuessFeedbackNeeded}
    resolveGuessFeedback={() => {
      invalidGuessFeedbackNeeded = false;
    }}
    {showWinningAnimation}
    on:last_letter_animation_end={showFeedback}
    on:winAnimationEnd={onWin}
    on:loseAnimationEnd={onLose}
  />
  <!-- on:last_letter_animation_end={() => console.log("ending")} -->
  <div>
    <Keyboard
      bind:currentGuess
      on:invalid_guess={() => (invalidGuessFeedbackNeeded = true)}
      {keyboardPlacements}
      onSubmit={handleSubmit}
      {isTypingPrevented}
    />
    {#if isDev}
      <button
        on:mousedown={() => {
          keyboardPlacements = getKeyboardLetterPlacements([]);
          clearState();
          isTypingPrevented = false;
        }}
        type="button">CLEAR STATE</button
      >
    {/if}
  </div>
</div>

<style>
  #game {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    position: relative;
    height: 100%;
  }

  @media (min-width: 641px) {
    #game {
      justify-content: space-around;
    }
  }
</style>
