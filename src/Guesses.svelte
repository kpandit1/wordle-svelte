<script>
  import store from "./store/index.js";
  // total 6 guesses
  function getLetterType(letter, index, guess) {
    // todo - update for multiple letter shenanigans
    if ($store.solution[index] === letter) {
      return "correct";
    }
    if ($store.solution.indexOf(letter) !== -1) {
      return "present";
    }
    return "absent";
  }
</script>

<div class="board">
  {#each $store.guesses as guess, i}
    <div class="row" class:completed={i < $store.guessIdx}>
      <!-- make sure each col is rendered by padding '' to '      '-->
      {#each guess.padEnd(5, " ") as letter, i}
        <div class={`cell ${getLetterType(letter, i, guess)}`}>{letter}</div>
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
  }
  .completed > * {
    color: white;
    border: 0;
  }
  .completed > .correct {
    background-color: #6aa964;
  }
  .completed > .present {
    background-color: #c9b458;
  }
  .completed > .absent {
    background-color: #787c7e;
  }
</style>
