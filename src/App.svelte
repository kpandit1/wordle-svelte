<script>
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
</script>

<main>
  <h1>Wordle</h1>
  <Guesses />
  <Keyboard />
</main>

<style>
  main {
    width: min(100% - 2rem, 600px);
    margin-inline: auto;
    display: block;
    text-align: center;
  }
  h1 {
    margin: 20px 20px 20px 0;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 2rem;
    text-transform: uppercase;
  }
</style>
