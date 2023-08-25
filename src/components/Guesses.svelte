<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { WINNING_ANIMATION_DURATION_MS } from "../animation";
  import Tile from "./Tile.svelte";
  import { MAX_NUM_GUESSES, WORD_LENGTH } from "../game/gameConstants";
  import type { WordPlacement } from "../game/game";

  export let guesses: readonly Word[];
  export let placements: readonly WordPlacement[];
  export let currentGuess: string;

  export let invalidGuessFeedbackNeeded: boolean;
  export let resolveGuessFeedback: () => void;

  export let showWinningAnimation: boolean;
  export let animationDuration: number;
  export let animationDelay: number;

  const dispatch = createEventDispatcher();

  // subtract an extra 1 to exclude word that is currently being entered
  $: numRemainingGuesses = Math.max(MAX_NUM_GUESSES - guesses.length - 1, 0);

  function handleAnimationEnd(e: AnimationEvent, i: number, j: number) {
    if (j === WORD_LENGTH - 1) {
      dispatch("last_letter_animation_end");
    }
  }

  function onWinAnimationEnd(e: AnimationEvent, i: number, j: number) {
    if (j === WORD_LENGTH - 1) {
      dispatch("winAnimationEnd");
    }
  }

  function handleShakeEnd(e: AnimationEvent) {
    // Fix for this issue
    // https://stackoverflow.com/questions/68307815/animationend-event-also-also-fires-on-end-of-animations-of-child-elements
    const animationOriginatesFromElt = e.currentTarget === e.target;
    if (animationOriginatesFromElt && invalidGuessFeedbackNeeded) {
      resolveGuessFeedback();
    }
  }
</script>

<div class="board">
  <!-- 1. Words that have already been guessed -->
  {#each guesses as guess, i}
    {@const wordPlacements = placements[i]}
    <div
      class="row completed"
      data-correct-word={wordPlacements.every((e) => e === "correct")
        ? "true"
        : "false"}
    >
      {#each guess as letter, j}
        <Tile
          placement={wordPlacements[j]}
          animateIn={true}
          --animation-delay="{j * animationDelay}ms"
          --animation-duration="{animationDuration}ms"
          --winning-animation-duration="{WINNING_ANIMATION_DURATION_MS}ms"
          --idx={j}
          class={showWinningAnimation ? "win" : ""}
          on:animationend={(e) =>
            showWinningAnimation
              ? onWinAnimationEnd(e, i, j)
              : handleAnimationEnd(e, i, j)}
        >
          {letter}
        </Tile>
      {/each}
    </div>
  {/each}

  <!-- 2. Word currently being entered -->
  {#if guesses.length !== MAX_NUM_GUESSES}
    <div
      class="row"
      class:shake={invalidGuessFeedbackNeeded}
      on:animationend={handleShakeEnd}
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
    animation-duration: var(--winning-animation-duration);
    animation-delay: calc(var(--idx) * 100ms);
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
