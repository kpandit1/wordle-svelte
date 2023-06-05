<script lang="ts">
  import Header from "./Header.svelte";
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toast from "./Toast.svelte";

  let currentGuess: Word = "";

  let invalidGuessFeedbackNeeded = false;
  let showWinningAnimation = false;
</script>

<main>
  <Header />
  <div id="game">
    <Toast />
    <Guesses
      {currentGuess}
      {invalidGuessFeedbackNeeded}
      resolveGuessFeedback={() => (invalidGuessFeedbackNeeded = false)}
      {showWinningAnimation}
    />
    <Keyboard
      bind:currentGuess
      on:invalid_guess={() => (invalidGuessFeedbackNeeded = true)}
      on:win={() => (showWinningAnimation = true)}
    />
  </div>
</main>

<style lang="postcss">
  main {
    width: min(100% - 1rem, 600px);
    margin-inline: auto;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  #game {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    position: relative;
    height: 100%;
  }

  @media (min-width: 641px) {
    #game {
      justify-content: space-around;
    }
  }
</style>
