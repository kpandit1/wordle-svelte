<script>
	import { dayNumber } from './../lib/constants/solutions.js';
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toast from "./Toast.svelte";
  import Settings from "./Settings.svelte";
</script>

<main>
  <div class="container">
    <header>
      <h1>Wordle #{dayNumber}</h1>
      <button type="button" data-a11y-dialog-show="settings-dialog">⚙️</button>
    </header>

    <div class="game">
      <Toast />
      <Guesses />
      <Keyboard />
      <Settings/>
    </div>
  </div>
</main>

<style>
  main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  header {
    display: flex;
    justify-content: center;
    gap: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  .container {
    width: min(100% - 2rem, 600px);
    margin-inline: auto;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    text-align: center;
    height: 100%;
  }

  header > button {
    max-width: max-content;
    align-self: center;
  }

  h1 {
    font-size: 2rem;
    text-transform: uppercase;
  }

  .game {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 2.5rem;
    position: relative;
    height: 100%;
  }
</style>
