<script lang="ts">
  import { MAX_NUM_GUESSES, WORD_LENGTH } from "../lib/constants";
  import { CELL_ANIMATION_DURATION_MS } from "../lib/constants/animation";
  import { ANIMATION_DELAY_MS } from "../lib/constants/animation";
  import { guesses, guessPlacements } from "./domain/game";

  export let currentGuess: string;

  // subtract an extra 1 to exclude word that is currently being entered
  $: numRemainingGuesses = Math.max(MAX_NUM_GUESSES - $guesses.length - 1, 0);
</script>

<div class="board">
  <!-- 1. Words that have already been guessed -->
  {#each $guesses as guess, i}
    <div class="row completed">
      {#each guess as letter, j}
        {@const placements = $guessPlacements[i]}
        <div
          class={`cell ${placements[j]}`}
          style:animation-delay="{j * ANIMATION_DELAY_MS}ms"
          style:animation-duration="{CELL_ANIMATION_DURATION_MS}ms"
        >
          {letter}
        </div>
      {/each}
    </div>
  {/each}

  <!-- 2. Word currently being entered -->
  {#if $guesses.length !== MAX_NUM_GUESSES}
    <div class="row">
      {#each currentGuess.padEnd(WORD_LENGTH) as letter}
        <div class="cell" class:non-empty={letter !== " "}>
          {letter}
        </div>
      {/each}
    </div>
  {/if}

  <!-- 3. Empty rows for remaining guesses -->
  {#each { length: numRemainingGuesses } as _}
    <div class="row">
      {#each { length: WORD_LENGTH } as __}
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
    animation: tile-flip-in-out both ease-in-out;
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

  .cell.non-empty {
    animation: pop 200ms;
  }

  @keyframes pop {
    0% {
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
