<script>
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
</script>

<main>
  <h1>Wordle</h1>
  <Guesses class="board"/>
  <Keyboard />
</main>

<style>
  main {
    width: min(100% - 2rem, 600px);
    margin-inline: auto;
  }
  /* h1 {
    margin: 20px 20px 20px 0;
    
  }
  main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	} */

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
