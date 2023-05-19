<script lang="ts">
  import { LETTER_PLACEMENT } from "../global-enums";

  export let animateIn = false;
  export let placement: LETTER_PLACEMENT = LETTER_PLACEMENT.NOT_GUESSED;
</script>

<div
  data-placement={placement}
  class={`cell ${$$props.class || ""}`}
  class:animateIn
>
  <slot />
</div>

<style>
  .cell {
    border: 2px solid var(--clr-cell-border);
    width: var(--size, 55px);
    height: var(--size, 55px);
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    text-transform: uppercase;
    font-weight: bold;
  }

  [data-placement="correct"] {
    background-color: var(--clr-correct);
    border: 0;
    color: white;
  }
  [data-placement="present"] {
    background-color: var(--clr-present);
    border: 0;
    color: white;
  }
  [data-placement="absent"] {
    background-color: var(--clr-absent);
    border: 0;
    color: white;
  }

  @keyframes tile-flip-in-out {
    /* using custom props in here causes bugs in Safari */
    0% {
      transform: rotateX(0);
      background-color: unset;
      color: unset;
      border: 2px solid var(--clr-cell-border-highlight);
    }
    50% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
      border: 0;
    }
  }

  .animateIn {
    animation: tile-flip-in-out both ease-in-out;
    animation-delay: var(--animation-delay, 0);
    animation-duration: var(--animation-duration, 500ms);
  }
</style>
