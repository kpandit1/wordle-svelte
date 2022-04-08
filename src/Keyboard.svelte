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

  function handleChange(key) {
    const input = key.target.value.toUpperCase().substring(0, 5);

    if ($store.guessIdx < 6) {
      store.update((state) => {
        state.guesses[state.guessIdx] = input;
        return state;
      });
    }
  }

  function handleKeydown(e) {
    if ($store.guessIdx >= 6) {
      // no more typing after 6 guesses
      return;
    }

    // check if key is a letter
    if (e.key.length === 1 && e.key.match(/[A-Za-z]/)) {
      store.update((state) => {
        const newGuess = state.guesses[state.guessIdx] + e.key.toUpperCase();
        state.guesses[state.guessIdx] = newGuess;
        return state;
      });
    }

    if (e.key === "Backspace") {
      store.update((state) => {
        state.guesses[state.guessIdx] = state.guesses[state.guessIdx].slice(0, -1);
        return state;
      });
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>
