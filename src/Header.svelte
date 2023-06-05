<script lang="ts">
  import { gameStatus, guesses } from "./domain/game";

  import ImgSetting from "./assets/Gear.svelte";
  import ImgHelp from "./assets/Help.svelte";
  import ImgStats from "./assets/BarGraph.svelte";
  import { numWins } from "./store/stats";
  import { dayNumber } from "./lib/constants";
  import { TOTAL_ANIMATION_DURATION } from "./lib/constants/animation";
  import SettingsDialog from "./SettingsDialog.svelte";
  import StatisticDialog from "./StatisticDialog.svelte";
  import HelpDialog from "./HelpDialog.svelte";

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

  const HELP_DIALOG_ID = "help-dialog";
  const STATS_DIALOG_ID = "stats-dialog";
</script>

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
      data-a11y-dialog-show={STATS_DIALOG_ID}
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
  <SettingsDialog />
  <StatisticDialog
    dialogId={STATS_DIALOG_ID}
    on:instance={(e) => (statsDialogInstance = e.detail.instance)}
  />
  <HelpDialog
    dialogId={HELP_DIALOG_ID}
    on:instance={(e) => (helpDialogInstance = e.detail.instance)}
  />
</header>

<style lang="postcss">
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
</style>
