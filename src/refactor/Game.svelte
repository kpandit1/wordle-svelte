<script lang="ts">
  import Guesses from "./src/Guesses.svelte";
  import Header from "./src/Header.svelte";
  import Keyboard from "./src/Keyboard.svelte";
  import Toaster from "./src/Toaster.svelte";
  import toast from "../store/toast";
  import getKeyboardLetterPlacements from "./keyboardLetterPlacements";
  import statsStore from "../store/stats";
  import {
    ANIMATION_DELAY_MS,
    CELL_ANIMATION_DURATION_MS,
  } from "../lib/constants/animation";
  import setupGame from "./setupGame";
  import dialogStore, { DialogId } from "./dialogs";
  import { WORD_LENGTH } from "./game";

  let game = setupGame();
  let currentGuess: Word = "";
  let invalidGuessFeedbackNeeded = false;
  let showWinningAnimation = false;
  let queuedFeedback: { status: GameStatus; solution: Word } | null = null;
  let keyboardPlacements = getKeyboardLetterPlacements(
    game.guesses,
    game.placements
  );
  // Typing is prevented while animations play out/ feedback for guesses is displayed
  // If there are any guesses, there will be feedback. So, prevent input
  // Typing is also prevented when game is over
  let shouldPreventInput: boolean = game.guesses.length > 0;
  const isDev = import.meta.env.MODE === "development";

  function showQueuedFeedback() {
    if (game.status === "in_progress") {
      // No further input needed if game over
      shouldPreventInput = false;
    }

    if (!queuedFeedback) {
      return;
    }

    // 1. Update on-screen keyboard letter placements
    keyboardPlacements = getKeyboardLetterPlacements(
      game.guesses,
      game.placements
    );

    // 2. Show win/lose feedback
    if (queuedFeedback.status === "win") {
      const numGuessesToMessageMap = {
        1: "Genius",
        2: "Magnificent",
        3: "Impressive",
        4: "Splendid",
        5: "Great",
        6: "Phew",
      };
      toast.setToast(numGuessesToMessageMap[game.guesses.length]);
      showWinningAnimation = true;
    } else if (queuedFeedback.status === "lose") {
      toast.setToast(queuedFeedback.solution.toUpperCase(), 7200 * 1000);
    }
    // 3. Show stats dialog if game over
    // If status is "win", then don't do anything since animation needs to play out before
    // further action is takes
    if (queuedFeedback?.status === "lose") {
      const SMALL_PADDING_MS = 1000;
      setTimeout(() => {
        dialogStore.set(DialogId.Stats);
      }, SMALL_PADDING_MS);
    }
  }

  function onWin() {
    dialogStore.set(DialogId.Stats);
  }

  function handleSubmit() {
    if (currentGuess === "danby") {
      toast.setToast("😍");
    }
    const feedback = game.submitGuess(currentGuess);

    if (!feedback.isValid) {
      // Invalid guess
      const msg = feedback.error;
      if (msg) {
        toast.setToast(msg);
      }
      invalidGuessFeedbackNeeded = true;
    } else {
      // Valid guess
      // Prevent input until queued feedback is popped/resolved
      shouldPreventInput = true;
      queuedFeedback = {
        status: game.status as GameStatus,
        solution: feedback.solution || "",
      };
      statsStore.updateStats(game);
      currentGuess = "";
    }
  }
</script>

<Header {game} />
<div id="game">
  <Toaster />
  <Guesses
    guesses={$game.guesses}
    placements={$game.placements}
    {currentGuess}
    {showWinningAnimation}
    animationDuration={CELL_ANIMATION_DURATION_MS}
    animationDelay={ANIMATION_DELAY_MS}
    {invalidGuessFeedbackNeeded}
    resolveGuessFeedback={() => {
      invalidGuessFeedbackNeeded = false;
    }}
    on:last_letter_animation_end={showQueuedFeedback}
    on:winAnimationEnd={onWin}
  />
  <div>
    <Keyboard
      bind:input={currentGuess}
      placements={keyboardPlacements}
      onSubmit={handleSubmit}
      {shouldPreventInput}
      maxInputLength={WORD_LENGTH}
    />
    {#if isDev}
      <button
        on:click={() => {
          game.reset();
          keyboardPlacements = getKeyboardLetterPlacements(
            game.guesses,
            game.placements
          );
          shouldPreventInput = false;
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
