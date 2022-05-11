<script>
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import settings from "../src/store/settings";
</script>

<main>
  <div class="container">
    <header>
      <h1>Wordle</h1>
      <button on:click={settings.toggleDarkMode}>☀️</button>
      <button on:click={settings.toggleContrast}>🌈</button>
      <!-- <button on:click={toggleHardMode}></button> -->
    </header>
    <Guesses />
    <Keyboard />
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
  }

  .container {
    width: min(100% - 2rem, 600px);
    margin-inline: auto;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  header > button {
    max-width: max-content;
    align-self: center;
  }

  h1 {
    font-size: 2rem;
    text-transform: uppercase;
  }
</style>
