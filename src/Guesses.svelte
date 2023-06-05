<script lang="ts">
  import { MAX_NUM_GUESSES, WORD_LENGTH } from "./lib/constants";
  import { CELL_ANIMATION_DURATION_MS } from "./lib/constants/animation";
  import { ANIMATION_DELAY_MS } from "./lib/constants/animation";
  import { guesses, guessPlacements } from "./domain/game";
  import Tile from "./components/Tile.svelte";

  export let currentGuess: string;
  export let invalidGuessFeedbackNeeded: boolean;
  export let resolveGuessFeedback: () => void;
  export let showWinningAnimation: boolean;

  // subtract an extra 1 to exclude word that is currently being entered
  $: numRemainingGuesses = Math.max(MAX_NUM_GUESSES - $guesses.length - 1, 0);
</script>

<div class="board">
  <!-- 1. Words that have already been guessed -->
  {#each $guesses as guess, i}
    {@const placements = $guessPlacements[i]}
    <div
      class="row completed"
      data-correct-word={placements.every((e) => e === "correct")
        ? "true"
        : "false"}
    >
      {#each guess as letter, j}
        <Tile
          placement={placements[j]}
          animateIn={true}
          --animation-delay="{j * ANIMATION_DELAY_MS}ms"
          --animation-duration="{CELL_ANIMATION_DURATION_MS}ms"
          --idx={j}
          class={showWinningAnimation ? "win" : ""}
        >
          {letter}
        </Tile>
      {/each}
    </div>
  {/each}

  <!-- 2. Word currently being entered -->
  {#if $guesses.length !== MAX_NUM_GUESSES}
    <div
      class="row"
      class:shake={invalidGuessFeedbackNeeded}
      on:animationend={() => {
        if (invalidGuessFeedbackNeeded) {
          resolveGuessFeedback();
        }
      }}
    >
      {#each currentGuess.padEnd(WORD_LENGTH) as letter}
        <Tile class={letter !== " " ? "entered" : ""}>
          {letter}
        </Tile>
      {/each}
    </div>
  {/if}

  <!-- 3. Empty rows for remaining guesses -->
  {#each { length: numRemainingGuesses } as _}
    <div class="row">
      {#each { length: WORD_LENGTH } as __}
        <Tile />
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

  .board :global(.entered) {
    border: 2px solid var(--clr-cell-border-highlight);
    animation: pop 200ms forwards;
  }

  [data-correct-word="true"] :global(.win) {
    animation-name: Bounce;
    animation-duration: 1000ms;
    animation-delay: calc(var(--idx) * 100ms);
    /* animation-delay: calc(var(--idx) * 100ms); */
    /* animation-fill-mode: forwards; */
  }

  .shake {
    animation-name: Shake;
    animation-duration: 800ms;
    animation-fill-mode: forwards;
  }

  @keyframes pop {
    from {
      transform: scale(0.8);
      opacity: 0;
    }

    40% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes Shake {
    10%,
    90% {
      transform: translateX(-1px);
    }

    20%,
    80% {
      transform: translateX(2px);
    }

    30%,
    50%,
    70% {
      transform: translateX(-4px);
    }

    40%,
    60% {
      transform: translateX(4px);
    }
  }
  @keyframes Bounce {
    0%,
    20% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    50% {
      transform: translateY(5px);
    }
    60% {
      transform: translateY(-15px);
    }
    80% {
      transform: translateY(2px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
