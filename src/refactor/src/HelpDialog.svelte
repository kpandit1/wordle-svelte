<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Tile from "./Tile.svelte";
  import Dialog from "./Dialog.svelte";
  import { MAX_NUM_GUESSES, WORD_LENGTH } from "../game";

  type DialogProps = ComponentProps<Dialog>;

  export let id: DialogProps["id"];
  export let open: DialogProps["open"];
  export let onOpen: DialogProps["onOpen"];
  export let onClose: DialogProps["onClose"];
</script>

<Dialog
  title="How to play"
  titleId="help-dialog-title"
  {id}
  {onOpen}
  {onClose}
  {open}
>
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
            <Tile placement="correct" animateIn={true}>W</Tile>
            <Tile placement="not_guessed">E</Tile>
            <Tile placement="not_guessed">A</Tile>
            <Tile placement="not_guessed" class="foo">R</Tile>
            <Tile placement="not_guessed">Y</Tile>
          </div>
          <p><strong>W</strong> is in the word and in the correct spot.</p>
        </li>
        <li>
          <div class="tile-row">
            <Tile placement="not_guessed">P</Tile>
            <Tile placement="present" animateIn={true}>I</Tile>
            <Tile placement="not_guessed">L</Tile>
            <Tile placement="not_guessed">L</Tile>
            <Tile placement="not_guessed">S</Tile>
          </div>
          <p><strong>I</strong> is in the word but in the wrong spot.</p>
        </li>
        <li>
          <div class="tile-row">
            <Tile placement="not_guessed">V</Tile>
            <Tile placement="not_guessed">A</Tile>
            <Tile placement="not_guessed">G</Tile>
            <Tile placement="absent" animateIn={true}>U</Tile>
            <Tile placement="not_guessed">E</Tile>
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
  .dialog-body {
    line-height: 1.3;
  }

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
  }

  .tile-row {
    display: flex;
    gap: 5px;
    font-size: 1.2rem;
    margin-bottom: 5px;
    --size: 32px;
  }
</style>
