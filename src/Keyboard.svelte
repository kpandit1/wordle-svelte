<script>
  import store from "./store/index.js";

  import { ALL_WORDS, SOLUTIONS } from "../lib/constants";

  $: currentGuess = $store.guesses[$store.guessIdx];

  function isValidWord(input) {
    // needs to be a 5 letter word
    if (input.length !== 5) {
      return false;
    }

    // needs to be a word
    return [...ALL_WORDS, ...SOLUTIONS].includes(input.toLowerCase());
  }

  function handleSubmit() {
    if (isValidWord(currentGuess)) {
      store.update((state) => {
        state.guessIdx += 1;
        return state;
      });
    }
  }

  function handleKeydown(e) {
    if (
      $store.guessIdx >= 6 ||
      $store.guesses[$store.guessIdx - 1] === $store.solution
    ) {
      // no more typing after 6 guesses or if the last guess was correct
      return;
    }

    // check if key is a letter and max length is 5
    if (
      e.key.length === 1 &&
      e.key.match(/[A-Za-z]/) &&
      currentGuess.length < 5
    ) {
      store.update((state) => {
        const newGuess = state.guesses[state.guessIdx] + e.key.toUpperCase();
        state.guesses[state.guessIdx] = newGuess;
        return state;
      });
    }

    if (e.key === "Backspace") {
      store.update((state) => {
        state.guesses[state.guessIdx] = state.guesses[state.guessIdx].slice(
          0,
          -1
        );
        return state;
      });
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="keyboard">
  <div class="row">
    {#each ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"] as letter}
      <button on:click={() => handleKeydown({ key: letter })}>{letter}</button>
    {/each}
  </div>
  <div class="row">
    {#each ["A", "S", "D", "F", "G", "H", "J", "K", "L"] as letter}
      <button on:click={() => handleKeydown({ key: letter })}>{letter}</button>
    {/each}
  </div>
  <div class="row">
    {#each ["Z", "X", "C", "V", "B", "N", "M"] as letter}
      <button on:click={() => handleKeydown({ key: letter })}>{letter}</button>
    {/each}
  </div>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }
  .row > button {
    padding: 0.5rem;
    font-size: 1.2rem;
    min-width: 2rem;
  }
</style>
