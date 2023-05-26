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

  import { isValidWord } from "./lib/helpers";
  import toast from "./store/toast.js";
  import { WORD_LENGTH } from "./lib/constants/gameConstants.js";
  import BackspaceSvg from "./components/BackspaceSVG.svelte";
  import { TOTAL_ANIMATION_DURATION } from "./lib/constants/animation";

  export let currentGuess: Word;
  let keyboardPlacements = getKeyboardLetterPlacements($guesses);

  // Handle UI updates after user submits guess
  function showFeedback(status: GameStatus, solution: Word) {
    // 1. Update on-screen keyboard letter placements
    const newKeyboardLetterPlacements = getKeyboardLetterPlacements($guesses);
    keyboardPlacements = newKeyboardLetterPlacements;

    // 2. Show win/lose feedback
    if (status === "win") {
      const numGuessesToMessageMap = {
        1: "Genius",
        2: "Magnificent",
        3: "Impressive",
        4: "Splendid",
        5: "Great",
        6: "Phew",
      };
      toast.setToast(numGuessesToMessageMap[$guesses.length]);
    } else if (status === "lose") {
      toast.setToast(solution, 7200 * 1000);
    }
  }

  function isGuessValid(): boolean {
    if (currentGuess.length < WORD_LENGTH) {
      toast.setToast("Not enough letters");
      return false;
    }
    if (currentGuess === "danby") {
      toast.setToast("😍");
      return true;
    }

    // only consider valid words
    if (!isValidWord(currentGuess)) {
      toast.setToast("Not in word list");
      return false;
    }

    if ($settings.hardMode) {
      const res = followsHardMode($guesses, currentGuess);
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
  async function handleSubmit() {
    if (!isGuessValid()) {
      return;
    }

    let status: GameStatus = "in_progress";
    let solution: Word | undefined = undefined;
    ({ status, solution } = submitGuess(currentGuess));

    await tick();

    if (status === "win") {
      addWin($guesses.length);
    } else if (status === "lose") {
      addLoss();
    }
    // Reset guess
    currentGuess = "";

    // wait for all animations to play out before feedback
    setTimeout(() => {
      showFeedback(status, solution);
    }, TOTAL_ANIMATION_DURATION);
  }

  function handleKeydown(e: UIEvent, key: string) {
    if ($gameStatus !== "in_progress") {
      return;
    }

    if (
      key.length === 1 &&
      key.match(/[A-Za-z]/) && // should be a letter
      currentGuess.length < WORD_LENGTH // limit to word length
    ) {
      currentGuess += key.toLowerCase();
    } else if (key === "Backspace") {
      currentGuess = currentGuess.slice(0, -1);
    } else if (key === "Enter") {
      // Adding checks since Enter from non-keyboard buttons shouldn't trigger a submit event
      // This is needed since the keydown event handler is attached to the window and always activates
      const target = e.target as HTMLElement;

      // don't trigger on button focus
      // unless the button has [data-key="*"] set (only true for keyboard)
      if (target.tagName !== "BUTTON" || target.dataset.key) {
        handleSubmit();
      }
    }
  }

  const isDev = import.meta.env.MODE === "development";
</script>

<svelte:window on:keydown={(e) => handleKeydown(e, e.key)} />
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
        on:click={(e) => handleKeydown(e, letter)}
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
    font-size: 0.95rem;
    min-width: max-content;
    flex: 1;
    max-width: 45px;
    height: 60px;
    cursor: pointer;
    font-weight: bold;
    color: var(--clr-text);
    text-transform: uppercase;
  }

  @media (min-width: 641px) {
    .row > button {
      font-size: 1rem;
    }
  }

  .row > button[data-key="Enter"] {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  @media (min-width: 641px) {
    .row > button[data-key="Enter"] {
      font-size: 0.9rem;
      padding: 0.7rem;
    }
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
