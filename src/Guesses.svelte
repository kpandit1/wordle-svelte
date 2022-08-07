<script>
  import { getLetterType } from "../lib/helpers.js";
  import store from "./store/index.js";
  import { guesses, currentGuess } from "./store/game.js";
  import { solution, NUM_GUESSES, WORD_LENGTH } from "../lib/constants";

  $: numRemainingGuesses = Math.max(NUM_GUESSES - $guesses.length - 1, 0);
</script>

<div class="board">
  {#each $guesses as guess, i}
    <div class="row completed">
      {#each guess as letter, j}
        <div class={`cell ${getLetterType(solution, guess, letter, j)}`}>
          {letter}
        </div>
      {/each}
    </div>
  {/each}

  {#if $guesses.length !== NUM_GUESSES}
    <div class="row">
      {#each $currentGuess.padEnd(WORD_LENGTH) as letter}
        <div class="cell">
          {letter}
        </div>
      {/each}
    </div>
  {/if}

  {#each Array(numRemainingGuesses).fill("") as blank}
    <div class="row">
      {#each $currentGuess.padEnd(WORD_LENGTH) as letter}
        <div class="cell">
          {blank}
        </div>
      {/each}
    </div>
  {/each}

  <!-- {#each Array(NUM_GUESSES) as _, i}
    <div class="row" class:completed={i < $guesses.length}>
      {#each getRow(i) as letter, j}
        <div class={`cell ${cellClass(i, letter)}`}>
          {letter}
        </div>
      {/each}
    </div>
  {/each} -->
</div>

<style>
  .board {
    font-size: 1.8rem;
    font-weight: bold;
    margin-inline: auto;
    width: max-content;
  }
  .row {
    display: flex;
    gap: 5px;
    margin-bottom: 5px;
  }
  .cell {
    border: 1px solid rgb(124, 118, 118);
    width: 60px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    text-transform: uppercase;
  }
  .cell:hover {
    animation: Shake 4s;
    animation-iteration-count: infinite;
  }

  @keyframes Shake {
    0% {
      transform: translate(0, -2px);
    }
    10% {
      transform: translate(-2px, 0);
    }

    20% {
      transform: translate(0, -2px);
    }

    30% {
      transform: translate(2px, 0);
    }

    40% {
      transform: translate(0, 0);
    }
  }

  .completed > * {
    color: white;
    border: 0;
  }
  .completed > .correct {
    background-color: var(--clr-correct);
  }
  .completed > .present {
    background-color: var(--clr-present);
  }
  .completed > .absent {
    background-color: var(--clr-absent);
  }
</style>
