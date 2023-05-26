<script lang="ts">
  import HelpDialog from "./HelpDialog.svelte";
  import { gameStatus, guesses } from "./domain/game";
  import { dayNumber } from "../lib/constants";
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import Toast from "./Toast.svelte";
  import Settings from "./Settings.svelte";
  import StatisticDialog from "./StatisticDialog.svelte";

  import ImgSetting from "./assets/Gear.svelte";
  import ImgHelp from "./assets/Help.svelte";
  import ImgStats from "./assets/BarGraph.svelte";
  import { TOTAL_ANIMATION_DURATION } from "../lib/constants/animation";
  import { numWins } from "./store/stats";

  let statsDialogInstance: any;
  let helpDialogInstance: any;

  $: {
    // Show stats dialog if game is over
    if (
      statsDialogInstance &&
      ($gameStatus === "win" || $gameStatus === "lose")
    ) {
      setTimeout(
        () => statsDialogInstance.show(),
        TOTAL_ANIMATION_DURATION * 1.5
      );
    }
  }

  $: {
    // Show help dialog if user's first time playing
    // i.e. no games won and no guesses made
    if (helpDialogInstance && $numWins === 0 && $guesses.length === 0) {
      helpDialogInstance.show();
    }
  }

  let currentGuess: Word = "";

  const HELP_DIALOG_ID = "help-dialog";
</script>

<main>
  <header>
    <h1>Wordle #{dayNumber}</h1>
    <div class="buttons">
      <button
        type="button"
        aria-label="game instructions"
        data-a11y-dialog-show={HELP_DIALOG_ID}
      >
        <ImgHelp />
      </button>
      <button
        type="button"
        aria-label="statistics"
        data-a11y-dialog-show="stats-dialog"
      >
        <ImgStats />
      </button>
      <button
        type="button"
        aria-label="settings"
        data-a11y-dialog-show="settings-dialog"
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
  <StatisticDialog
    on:instance={(e) => (statsDialogInstance = e.detail.instance)}
  />
  <HelpDialog
    dialogId={HELP_DIALOG_ID}
    on:instance={(e) => (helpDialogInstance = e.detail.instance)}
  />
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
    font-size: 1.5rem;
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
