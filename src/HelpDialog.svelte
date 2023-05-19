<script lang="ts">
  import { MAX_NUM_GUESSES, WORD_LENGTH } from "../lib/constants";
  import Tile from "./components/Tile.svelte";
  import Dialog from "./Dialog.svelte";
  import { LETTER_PLACEMENT } from "./global-enums";

  export let dialogId: string;
</script>

<Dialog id={dialogId} title="How to play" titleId="help-dialog-title">
  <div class="dialog-body">
    <section>
      <ul class="instructions">
        <li>Guess the Wordle in {MAX_NUM_GUESSES} tries.</li>
        <li>Each guess must be a valid {WORD_LENGTH}-letter word.</li>
        <li>
          The color of the tiles will change to show how close your guess was to
          the word.
        </li>
      </ul>
    </section>
    <section>
      <p style="font-weight:800">Examples</p>

      <ul class="examples">
        <li>
          <div class="tile-row">
            <Tile placement={LETTER_PLACEMENT.CORRECT} animateIn={true}>W</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>E</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>A</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED} class="foo">R</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>Y</Tile>
          </div>
          <p><strong>W</strong> is in the word and in the correct spot.</p>
        </li>
        <li>
          <div class="tile-row">
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>P</Tile>
            <Tile placement={LETTER_PLACEMENT.PRESENT} animateIn={true}>I</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>L</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>L</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>S</Tile>
          </div>
          <p><strong>I</strong> is in the word but in the wrong spot.</p>
        </li>
        <li>
          <div class="tile-row">
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>V</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>A</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>G</Tile>
            <Tile placement={LETTER_PLACEMENT.ABSENT} animateIn={true}>U</Tile>
            <Tile placement={LETTER_PLACEMENT.NOT_GUESSED}>E</Tile>
          </div>
          <p><strong>U</strong> is not in the word in any spot.</p>
        </li>
      </ul>
    </section>
    <section>
      <p>
        A new <span style="text-transform: uppercase;">Wordle</span> will be available
        each day!
      </p>
    </section>
  </div>
</Dialog>

<style>
  :global(#help-dialog-title) {
    text-transform: capitalize;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .examples {
    margin-top: 0.5rem;
  }

  .examples li:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  section {
    border-bottom: 2px solid var(--clr-cell-border);
    padding-block: 0.5rem;
  }

  section:last-of-type {
    border-bottom: none;
  }

  .dialog-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .instructions > li {
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  .tile-row {
    display: flex;
    gap: 5px;
    font-size: 1.2rem;
    margin-bottom: 5px;
    --size: 32px;
  }
</style>
