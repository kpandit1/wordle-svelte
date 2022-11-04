<script>
  import { addWin, addLoss } from "./store/stats.js";
  import { GAME_STATES } from "./../lib/constants/gameConstants.js";
  import {
    currentGuess,
    guesses,
    submitGuess,
    followsHardMode,
    clearState,
  } from "./store/game.js";
  import settings from "./store/settings";

  import { getKeyColor, isValidWord } from "../lib/helpers";
  import { solution } from "../lib/constants/solutions.js";
  import toast from "../src/store/toast";
  import { WORD_LENGTH } from "../lib/constants/gameConstants.js";

  const BACKSPACE_KEY = "\u232b";

  function handleSubmit() {
    if ($currentGuess.length < WORD_LENGTH) {
      toast.setToast("Not enough letters");
      return;
    }

    // only consider valid words
    if (!isValidWord($currentGuess)) {
      toast.setToast("Not in word list");
      return;
    }

    let gameState = GAME_STATES.IN_PROGRESS;

    if ($settings.hardMode) {
      const [isValid, errorMessage] = followsHardMode($currentGuess);

      if (isValid) {
        gameState = submitGuess();
      } else {
        toast.setToast(errorMessage);
      }
    } else {
      // no hard mode, just submit
      gameState = submitGuess();
    }

    if (gameState === GAME_STATES.WON) {
      addWin($guesses.length);
    }
    if (gameState === GAME_STATES.LOST) {
      addLoss();
    }
  }

  function handleKeydown(e) {
    if ($guesses.length >= 6 || $guesses[$guesses.length - 1] === solution) {
      // no more typing after 6 guesses or if the last guess was correct
      return;
    }

    if (
      e.key.length === 1 &&
      e.key.match(/[A-Za-z]/) && // should be a letter
      $currentGuess.length < WORD_LENGTH // shouldn't be able to type a word longer than 5 letters
    ) {
      currentGuess.update((prevGuess) => prevGuess + e.key.toLowerCase());
    }

    if (e.key === "Backspace" || e.key === BACKSPACE_KEY) {
      currentGuess.update((prevGuess) => prevGuess.slice(0, -1));
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="keyboard">
  <!--prettier-ignore-->
  {#each [ 
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", BACKSPACE_KEY]]
    as row
  }
    <div class="row">
      {#each row as letter}
        <button
          on:mousedown={(e) => handleKeydown({ ...e, key: letter })}
          class={getKeyColor(
            letter.toLowerCase(),
            solution,
            $guesses
          )}
          data-key={letter === BACKSPACE_KEY ? "Backspace" : letter}
          type="button">{letter}</button
        >
      {/each}
    </div>
  {/each}

  {#if !process.env.production}
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
    font-size: 1rem;
    min-width: max-content;
    flex: 1;
    max-width: 40px;
    height: 60px;
    cursor: pointer;
    font-weight: bold;
    color: var(--clr-text);
    text-transform: uppercase;
  }

  .row > button[data-key="Enter"] {
    font-size: 0.9rem;
  }
  .row > button[data-key="Backspace"] {
    flex: 2.5;
  }
  /* media query  */
  /* @media (max-width: 600px) {
    .row > button {
    }
  } */

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
