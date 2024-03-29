<script lang="ts">
  import Guesses from "./Guesses.svelte";
  import Header from "./Header.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toaster from "./Toaster.svelte";
  import toast from "../toast";
  import getKeyboardLetterPlacements from "../keyboardLetterPlacements";
  import statsStore from "../stats";
  import setupGame from "../setup/setupGame";
  import dialogStore, { DialogId } from "../dialogs";
  import { WORD_LENGTH } from "../game/gameConstants";
  import { currentDayIndex } from "../currentDayIndex";

  let game = setupGame(currentDayIndex);
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
    if (queuedFeedback.status === "lose") {
      const SMALL_PADDING_MS = 1000;

      if ($dialogStore === null) {
        setTimeout(() => {
          dialogStore.set(DialogId.Stats);
        }, SMALL_PADDING_MS);
      }
    }
    queuedFeedback = null;
  }

  function onWinAnimationEnd() {
    if ($dialogStore === null) {
      dialogStore.set(DialogId.Stats);
    }
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

  function clear() {
    game.reset();
    keyboardPlacements = getKeyboardLetterPlacements(
      game.guesses,
      game.placements
    );
    shouldPreventInput = false;
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
    {invalidGuessFeedbackNeeded}
    resolveGuessFeedback={() => {
      invalidGuessFeedbackNeeded = false;
    }}
    on:lastLetterAnimationEnd={showQueuedFeedback}
    on:winAnimationEnd={onWinAnimationEnd}
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
      <button on:click={clear} type="button">CLEAR </button>
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
