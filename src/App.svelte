<script>
  import { GAME_STATES } from "./../lib/constants/gameConstants.js";
  import { dayNumber } from "./../lib/constants";
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toast from "./Toast.svelte";
  import Settings from "./Settings.svelte";
  import { gameState } from "./store/game.js";
  import StatisticDialog from "./StatisticDialog.svelte";
  let dialogInstance;

  const assignDialogInstance = (ev) => {
    dialogInstance = ev.detail.instance;
  };

  $: {
    if (
      dialogInstance &&
      ($gameState === GAME_STATES.WON || $gameState === GAME_STATES.LOST)
    ) {
      setTimeout(() => dialogInstance.show(), 2000);
    }
  }
</script>

<main>
  <div class="container">
    <header>
      <h1>Wordle #{dayNumber}</h1>
      <!-- Prevent button in focus from being clicked by keypress events  -->
      <button
        type="button"
        data-a11y-dialog-show="settings-dialog"
        on:keypress|preventDefault>⚙️</button
      >
      <button
        type="button"
        data-a11y-dialog-show="stats-dialog"
        on:keypress|preventDefault>📊</button
      >
    </header>

    <div class="game">
      <Toast />
      <Guesses />
      <Keyboard />
    </div>
    <Settings />
    <StatisticDialog on:instance={assignDialogInstance} />
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
    justify-content: space-around;
    gap: 1.5rem;
    position: relative;
    height: 100%;
  }
</style>
