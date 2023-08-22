<script lang="ts">
  import BackspaceSvg from "./assets/BackspaceSVG.svelte";

  export let input: string;
  export let maxInputLength: number;
  export let placements: Record<string, LetterPlacement>;
  export let onSubmit: (word: string) => void;
  export let shouldPreventInput: boolean;

  function handleKeydown(e: UIEvent, key: string) {
    if (shouldPreventInput) {
      return;
    }

    if (
      key.length === 1 &&
      key.match(/[A-Za-z]/) && // should be a letter
      input.length < maxInputLength // limit to word length
    ) {
      input += key.toLowerCase();
    } else if (key === "Backspace") {
      input = input.slice(0, -1);
    } else if (key === "Enter") {
      // Adding checks since Enter from non-keyboard buttons shouldn't trigger a submit event
      // This is needed since the keydown event handler is attached to the window and always activates
      const target = e.target as HTMLElement;

      // don't trigger on button focus
      // unless the button has [data-key="*"] set (only true for keyboard)
      if (target.tagName !== "BUTTON" || target.dataset.key) {
        onSubmit(input);
      }
    }
  }
</script>

<svelte:window on:keydown={(e) => handleKeydown(e, e.key)} />
<div class="keyboard">
  <!--prettier-ignore-->
  {#each [ 
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]]
    as row
  }
    <div class="row">
      {#each row as letter}
        <button
        on:click={(e) => handleKeydown(e, letter)}
        class={placements[letter.toLowerCase()] ?? ""}
          data-key={letter}
          type="button">
            {#if letter === "Backspace"} 
              <BackspaceSvg />
            {:else}
              {letter}
            {/if}
          </button
        >
      {/each}
    </div>
  {/each}
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.375rem;
    touch-action: manipulation;
    margin-bottom: 0.5rem;
  }
  .row > button {
    touch-action: manipulation;
    font-size: 1.25rem;
    flex: 1;
    height: 58px;
    cursor: pointer;
    font-weight: bold;
    color: var(--clr-text);
    text-transform: uppercase;
    margin: 0;
    padding: 0;
  }

  .row > button[data-key="Enter"],
  button[data-key="Backspace"] {
    font-size: 0.75rem;
    flex: 1.5;
    /* padding: 0.5rem; */
  }

  .row > button[data-key="A"] {
    margin-left: 5%;
  }
  .row > button[data-key="L"] {
    margin-right: 5%;
  }

  button.not-guessed {
    background-color: var(--clr-key-bg);
  }
  button.correct {
    background-color: var(--clr-correct);
    color: white;
  }
  button.present {
    background-color: var(--clr-present);
    color: white;
  }
  button.absent {
    background-color: var(--clr-absent);
    color: white;
  }
</style>
