<script>
  import store from "./store/index.js";

  import { getKeyColor, isValidWord } from "../lib/helpers";
  import { solution } from "../lib/constants/solutions.js";

  $: currentGuess = $store.guesses[$store.guessIdx];

  function handleSubmit() {
    if (isValidWord(currentGuess)) {
      store.guessNextWord();
    }
  }

  function handleKeydown(e) {
    if (
      $store.guessIdx >= 6 ||
      $store.guesses[$store.guessIdx - 1] === solution
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
        const newGuess = state.guesses[state.guessIdx] + e.key.toLowerCase();
        state.guesses[state.guessIdx] = newGuess;
        return state;
      });
    }

    if (e.key === "Backspace") {
      store.update((state) => {
        // prettier-ignore
        state.guesses[state.guessIdx] = state.guesses[state.guessIdx].slice( 0, -1);
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
  <!--prettier-ignore-->
  {#each [ 
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]]
    as row
  }
    <div class="row">
      {#each row as letter}
        <button
          on:mousedown={(e) => handleKeydown({ ...e, key: letter })}
          class={getKeyColor(
            letter.toLowerCase(),
            solution,
            $store.guesses.slice(0, $store.guessIdx)
          )}
          type="button">{letter}</button
        >
      {/each}
    </div>
  {/each}


  <button on:mousedown={store.clearState} type="button">CLEAR STATE</button>
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
    padding: 0.7rem;
    font-size: 1rem;
    width: min(9vw, 50px);
    height: 60px;
    cursor: pointer;
    font-weight: bold;
    color: var(--clr-text);
  }
  .not-guessed {
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
