<script lang="ts">
  import { tick } from "svelte";
  import {
    clearState,
    followsHardMode,
    gameStatus,
    getKeyboardLetterPlacements,
    guesses,
    submitGuess,
  } from "./domain/game";
  import { addWin, addLoss } from "./store/stats.js";
  import settings from "./store/settings";

  import { isValidWord } from "../lib/helpers";
  import toast from "./store/toast.js";
  import { WORD_LENGTH } from "../lib/constants/gameConstants.js";
  import BackspaceSvg from "./components/BackspaceSVG.svelte";
  import { GameStatus } from "./global-enums";
  import { lastPlayedDayNumber } from "./domain/usage";
  import { dayNumber } from "../lib/constants";
  import { TOTAL_ANIMATION_DURATION } from "../lib/constants/animation";

  export let currentGuess: Word;
  let keyboardPlacements = getKeyboardLetterPlacements($guesses);

  // Handle UI updates after user submits guess
  function showFeedback(status: GameStatus, solution: Word) {
    // 1. Update on-screen keyboard letter placements
    const newKeyboardLetterPlacements = getKeyboardLetterPlacements($guesses);
    keyboardPlacements = newKeyboardLetterPlacements;

    // 2. Show win/lose feedback
    if (status === GameStatus.WON) {
      const numGuessesToMessageMap = {
        1: "Genius",
        2: "Magnificent",
        3: "Impressive",
        4: "Splendid",
        5: "Great",
        6: "Phew",
      };
      toast.setToast(numGuessesToMessageMap[$guesses.length]);
    } else if (status === GameStatus.LOST) {
      toast.setToast(solution, 7200 * 1000);
    }
  }

  // Submit current guess
  async function handleSubmit() {
    if (currentGuess.length < WORD_LENGTH) {
      toast.setToast("Not enough letters");
      return;
    }
    if (currentGuess === "danby") {
      toast.setToast("😍");
    }

    // only consider valid words
    else if (!isValidWord(currentGuess)) {
      toast.setToast("Not in word list");
      return;
    }

    let status = GameStatus.IN_PROGRESS;
    let solution: Word | undefined = undefined;

    if ($settings.hardMode) {
      const res = followsHardMode($guesses, currentGuess);

      if (res.ok) {
        ({ status, solution } = submitGuess(currentGuess));
      } else {
        toast.setToast(res.errorMessage);
        return;
      }
    } else {
      // no hard mode, just submit
      ({ status, solution } = submitGuess(currentGuess));
    }

    await tick();

    if (status === GameStatus.WON) {
      addWin($guesses.length);
    } else if (status === GameStatus.LOST) {
      addLoss();
    }
    // Reset guess
    currentGuess = "";
    // Update usage
    lastPlayedDayNumber.set(dayNumber);

    // wait for all animations to play out before feedback
    setTimeout(() => {
      showFeedback(status, solution);
    }, TOTAL_ANIMATION_DURATION);
  }

  function handleKeydown(e: { key: string }) {
    if ($gameStatus !== GameStatus.IN_PROGRESS) {
      return;
    }

    if (
      e.key.length === 1 &&
      e.key.match(/[A-Za-z]/) && // should be a letter
      currentGuess.length < WORD_LENGTH // limit to word length
    ) {
      currentGuess += e.key.toLowerCase();
    }

    if (e.key === "Backspace") {
      currentGuess = currentGuess.slice(0, -1);
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  const isDev = import.meta.env.MODE === "development";
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="keyboard">
  <!--prettier-ignore-->
  {#each [ 
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]]
    as row
  }
    <div class="row">
      {#each row as letter}
        <button
        on:click={(e) => handleKeydown({ ...e, key: letter })}
        class={keyboardPlacements[letter.toLowerCase()] ?? ""}
          data-key={letter}
          type="button">
            {#if letter === "Backspace"} 
              <BackspaceSvg />
            {:else}
              {letter}
            {/if}
          </button
        >
      {/each}
    </div>
  {/each}

  {#if isDev}
    <button
      on:mousedown={() => {
        keyboardPlacements = getKeyboardLetterPlacements([]);
        clearState();
      }}
      type="button">CLEAR STATE</button
    >
  {/if}
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    touch-action: manipulation;
  }
  .row > button {
    touch-action: manipulation;
    /* padding: 0.7rem; */
    font-size: 0.8rem;
    min-width: max-content;
    flex: 1;
    max-width: 45px;
    height: 60px;
    cursor: pointer;
    font-weight: bold;
    color: var(--clr-text);
    text-transform: uppercase;
  }

  .row > button[data-key="Enter"] {
    font-size: 0.75rem;
  }

  .row > button[data-key="A"] {
    margin-left: 13px;
  }
  .row > button[data-key="L"] {
    margin-right: 13px;
  }

  button.not-guessed {
    background-color: var(--clr-key-bg);
  }
  button.correct {
    background-color: var(--clr-correct);
    color: white;
  }
  button.present {
    background-color: var(--clr-present);
    color: white;
  }
  button.absent {
    background-color: var(--clr-absent);
    color: white;
  }
</style>
