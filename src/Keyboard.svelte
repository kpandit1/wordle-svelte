<script lang="ts">
  import {
    clearState,
    followsHardMode,
    gameStatus,
    guesses,
    keyboardLetterPlacements,
    submitGuess,
  } from "./domain/game";
  import { addWin, addLoss } from "./store/stats.js";
  import settings from "./store/settings";

  import { getKeyColor, isValidWord } from "../lib/helpers";
  import toast from "./store/toast.js";
  import { WORD_LENGTH } from "../lib/constants/gameConstants.js";
  import BackspaceSvg from "./components/BackspaceSVG.svelte";
  import { GameStatus } from "./global-enums";
  import { lastPlayedDayNumber } from "./domain/usage";
  import { dayNumber } from "../lib/constants";

  export let currentGuess: Word;

  function handleSubmit() {
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

    let gameStatus = GameStatus.IN_PROGRESS;

    if ($settings.hardMode) {
      const res = followsHardMode($guesses, currentGuess);

      if (res.ok) {
        gameStatus = submitGuess(currentGuess);
      } else {
        toast.setToast(res.errorMessage);
        return;
      }
    } else {
      // no hard mode, just submit
      gameStatus = submitGuess(currentGuess);
    }

    if (gameStatus === GameStatus.WON) {
      toast.setToast("Nice!");
      addWin($guesses.length);
    }
    if (gameStatus === GameStatus.LOST) {
      // toast.setToast(solution.toUpperCase(), 7200 * 1000);
      addLoss();
    }

    // Reset guess
    currentGuess = "";
    // Update usage
    lastPlayedDayNumber.set(dayNumber);
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
          on:mousedown={(e) => handleKeydown({ ...e, key: letter })}
          class={$keyboardLetterPlacements[letter.toLowerCase()]}
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
    <button on:mousedown={clearState} type="button">CLEAR STATE</button>
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
