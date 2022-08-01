<script>
  import store from "./store/index.js";
  import settings from "./store/settings";

  import { getKeyColor, getLetterType, isValidWord } from "../lib/helpers";
  import { solution } from "../lib/constants/solutions.js";
  import toast from "../src/store/toast";

  $: currentGuess = $store.guesses[$store.guessIdx];

  const backspaceKey = "\u232b";

  function handleSubmit() {
    // only consider valid words
    if (!isValidWord(currentGuess)) {
      toast.setToast("Not in word list");
      return;
    }

    // if not hard mode, since the word is valid, move on to the next guess
    if (!$settings.hardMode) {
      store.guessNextWord();
      return;
    }

    // if hard mode, there are 2 rules
    // all previous 'present' letters must be reused
    // all previous 'correct' letters must be correct again

    // get all previous 'present' and 'found' letters
    let presentLetters = new Set();
    let correctLetters = [];

    $store.guesses.forEach((guess) => {
      guess.split("").forEach((letter, i) => {
        if (getLetterType(solution, currentGuess, letter, i) === "present") {
          presentLetters.add(letter);
        } else if (
          getLetterType(solution, currentGuess, letter, i) === "correct"
        ) {
          correctLetters.push({ letter: letter, idx: i });
        }
      });
    });

    // check if all previous 'correct' letters are correct
    for (let i = 0; i < correctLetters.length; i++) {
      const l = correctLetters[i];
      if (currentGuess[l.idx] !== l.letter) {
        // TODO: fix the number suffix (1st, 2nd, 3rd)
        toast.setToast(l.idx + 1 + "th letter must be " + l.letter);
        return;
      }
    }

    // check all previously 'present' letters are used in the current guess
    for (const letter of presentLetters) {
      if (!currentGuess.includes(letter)) {
        toast.setToast("guess must contain " + letter);
        return;
      }
    }
    store.guessNextWord();

    // if (isValidWord(currentGuess)) {
    //   store.guessNextWord();
    // }
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

    if (e.key === "Backspace" || e.key === backspaceKey) {
      store.update((state) => {
        // prettier-ignore
        state.guesses[state.guessIdx] = state.guesses[state.guessIdx].slice(0, -1);
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
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", backspaceKey]]
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

  {#if !process.env.production}
    <button on:mousedown={store.clearState} type="button">CLEAR STATE</button>
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
    width: min(9vw, 50px);
    width: "200px";
    height: 60px;
    cursor: pointer;
    font-weight: bold;
    color: var(--clr-text);
    text-transform: uppercase;
  }
  /* media query  */
  /* @media (max-width: 600px) {
    .row > button {
    }
  } */

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
