<script>
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
</script>

<svelte:head>
  <script src="./darkmode.js"></script>
</svelte:head>

<main>
  <div class="container">
    <header>
      <h1>Wordle</h1>
      <button id="dark-mode-toggle">☀️</button>
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
    /* margin: 12px 12px 12px 0; */
    font-size: 2rem;
    text-transform: uppercase;
  }
</style>
