<script lang="ts">
  import { NUM_GUESSES, WORD_LENGTH } from "../lib/constants";
  import { guesses, guessPlacements } from "./domain/game";

  export let currentGuess: string;

  $: numRemainingGuesses = Math.max(NUM_GUESSES - $guesses.length - 1, 0);
</script>

<div class="board">
  {#each $guesses as guess, i}
    <div class="row completed">
      {#each guess as letter, j}
        {@const placements = $guessPlacements[i]}
        <div
          class={`cell ${placements[j]}`}
          style="animation-delay: {j * 250}ms;"
        >
          {letter}
        </div>
      {/each}
    </div>
  {/each}

  {#if $guesses.length !== NUM_GUESSES}
    <div class="row">
      {#each currentGuess.padEnd(WORD_LENGTH) as letter}
        <div class="cell">
          {letter}
        </div>
      {/each}
    </div>
  {/if}

  {#each Array(numRemainingGuesses).fill("") as _}
    <div class="row">
      {#each currentGuess.padEnd(WORD_LENGTH) as __}
        <div class="cell" />
      {/each}
    </div>
  {/each}
</div>

<style lang="postcss">
  .board {
    font-size: 1.8rem;
    font-weight: 950;
    margin-inline: auto;
    width: max-content;
    user-select: none;
    -webkit-user-select: none;
  }
  .row {
    display: flex;
    gap: 5px;
    margin-bottom: 5px;
  }
  .cell {
    border: 1px solid rgb(124, 118, 118);
    width: 55px;
    height: 55px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    text-transform: uppercase;
    font-weight: bold;
  }

  @keyframes tile-flip-in-out {
    /* using custom props in here causes bugs in Safari */
    0% {
      transform: rotateX(0);
      background-color: unset;
    }
    50% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
      color: white;
      border: 0;
    }
  }

  .completed > .cell {
    animation: tile-flip-in-out 800ms both ease-in-out;
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
