<script lang="ts">
  import { gameStatus } from "./domain/game";
  import { dayNumber } from "../lib/constants";
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toast from "./Toast.svelte";
  import Settings from "./Settings.svelte";
  import StatisticDialog from "./StatisticDialog.svelte";
  import { GameStatus } from "./global-enums";

  import ImgSetting from "./assets/Gear.svelte";
  import ImgHelp from "./assets/Help.svelte";
  import ImgStats from "./assets/BarGraph.svelte";

  let dialogInstance: any;

  const assignDialogInstance = (ev: any) => {
    dialogInstance = ev.detail.instance;
  };

  $: {
    if (
      dialogInstance &&
      ($gameStatus === GameStatus.WON || $gameStatus === GameStatus.LOST)
    ) {
      setTimeout(() => dialogInstance.show(), 3000);
    }
  }

  let currentGuess: Word = "";
</script>

<main>
  <header>
    <h1>Wordle #{dayNumber}</h1>
    <!-- Prevent button in focus from being clicked by keypress events  -->

    <div class="buttons">
      <button type="button" on:keypress|preventDefault>
        <ImgHelp />
      </button>
      <button
        type="button"
        data-a11y-dialog-show="stats-dialog"
        on:keypress|preventDefault
      >
        <ImgStats />
      </button>
      <button
        type="button"
        aria-label="Settings"
        data-a11y-dialog-show="settings-dialog"
        on:keypress|preventDefault
      >
        <ImgSetting />
      </button>
    </div>
  </header>

  <div id="game">
    <Toast />
    <Guesses {currentGuess} />
    <Keyboard bind:currentGuess />
  </div>
  <Settings />
  <StatisticDialog on:instance={assignDialogInstance} />
</main>

<style lang="postcss">
  main {
    width: min(100% - 1rem, 600px);
    margin-inline: auto;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    text-align: center;
    height: 100%;
  }

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--clr-cell-border);
    padding-block: 5px;
  }

  .buttons {
    display: flex;
  }

  .buttons > button {
    background-color: transparent;
    width: 35px;
    height: 35px;
    margin-block: auto;
    display: grid;
    place-items: center;
  }

  h1 {
    font-size: 1.8rem;
    text-transform: uppercase;
  }

  #game {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    position: relative;
    height: 100%;
    /* overflow: hidden; */
  }

  @media (min-width: 641px) {
    #game {
      justify-content: space-around;
    }
  }
</style>
