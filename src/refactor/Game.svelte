<script lang="ts">
  import { gameStatus } from "../domain/game";
  import Guesses from "../Guesses.svelte";
  import Header from "../Header.svelte";
  import Keyboard from "../Keyboard.svelte";
  import Toast from "../Toast.svelte";
  import { getKeyboardLetterPlacements } from "../domain/game";
  import toast from "../store/toast";
  import settings from "../store/settings";
  import { addLoss, addWin } from "../store/stats";
  import {
    ANIMATION_DELAY_MS,
    CELL_ANIMATION_DURATION_MS,
  } from "../lib/constants/animation";
  import { onMount } from "svelte";
  import { setupGame } from "./setupGame";
  import type { WordPlacement } from "./game";

  let game = setupGame($settings.hardMode);
  let currentGuess: Word = "";

  let invalidGuessFeedbackNeeded = false;
  let showWinningAnimation = false;

  let feedback: { status: GameStatus; solution: Word } | null = null;

  let headerRef: any;

  let isTypingPrevented: boolean = $game.guesses.length > 0;
  const isDev = import.meta.env.MODE === "development";

  function showStatsDialog() {
    headerRef.showStatsDialog();
  }
  function showFeedback() {
    if ($gameStatus === "in_progress") {
      isTypingPrevented = false;
    }

    if (!feedback) {
      return;
    }

    // 1. Update on-screen keyboard letter placements
    keyboardPlacements = getKeyboardLetterPlacements($game.guesses);

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
      toast.setToast(numGuessesToMessageMap[$game.guesses.length]);
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

  function handleSubmit() {
    if (currentGuess === "danby") {
      toast.setToast("😍");
    }
    const submitFeedback = game.submitGuess(currentGuess);

    if (!submitFeedback.isValid) {
      const msg = submitFeedback.error;
      if (msg) {
        toast.setToast(msg);
      }
      invalidGuessFeedbackNeeded = true;
      return;
    } else {
      isTypingPrevented = true;

      if (game.status === "win") {
        addWin(game.guesses.length);
      } else if (game.status === "lose") {
        addLoss();
      }
      // Reset guess
      currentGuess = "";
      feedback = {
        status: game.status as GameStatus,
        solution: submitFeedback.solution || "",
      };
    }
  }

  let keyboardPlacements = getKeyboardLetterPlacements($game.guesses);

  let animationDuration = CELL_ANIMATION_DURATION_MS;
  let animationDelay = ANIMATION_DELAY_MS;

  onMount(() => {
    if ($gameStatus !== "in_progress") {
      animationDuration = CELL_ANIMATION_DURATION_MS / 1.5;
      animationDelay = ANIMATION_DELAY_MS / 1.7;
    }
  });

  $: placements = $game.placements as WordPlacement[];
</script>

<Header bind:this={headerRef} />
<div id="game">
  <Toast />
  <!-- 1. change resolveGuessFeedback/invalidGuessFeedbackNeeded  bind:this={guessElt} and guessElt.showInvalidGuessFeedback(); -->
  <!-- 2.  consistent animationDuration -->
  <Guesses
    guesses={$game.guesses}
    {placements}
    {currentGuess}
    {showWinningAnimation}
    on:last_letter_animation_end={showFeedback}
    on:winAnimationEnd={onWin}
    on:loseAnimationEnd={onLose}
    {animationDuration}
    {animationDelay}
    {invalidGuessFeedbackNeeded}
    resolveGuessFeedback={() => {
      invalidGuessFeedbackNeeded = false;
    }}
  />
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
          game.reset();
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
