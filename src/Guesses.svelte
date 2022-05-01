<script>
  import { getLetterType } from "../lib/helpers.js";
  import store from "./store/index.js";
  import { solution } from "../lib/constants";
</script>

<div class="board">
  {#each $store.guesses as guess, i}
    <div class="row" class:completed={i < $store.guessIdx}>
      <!-- make sure each col is rendered by padding '' to '      '-->
      {#each guess.padEnd(5, " ") as letter, i}
        <div class={`cell ${getLetterType(solution, guess, letter, i)}`}>
          {letter}
        </div>
      {/each}
    </div>
  {/each}
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
  .completed > * {
    color: white;
    border: 0;
  }
  .completed > .correct {
    background-color: var(--clr-correct);
  }
  .completed > .present {
    background-color: var(--clr-present)
  }
  .completed > .absent {
    background-color: var(--clr-absent)
  }
</style>
