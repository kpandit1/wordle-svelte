<script lang="ts">
  import { get } from "svelte/store";
  import ImgSetting from "./assets/Gear.svelte";
  import ImgHelp from "./assets/Help.svelte";
  import ImgStats from "./assets/BarGraph.svelte";

  import SettingsDialog from "./SettingsDialog.svelte";
  import StatisticDialog from "./StatisticsDialog.svelte";
  import { onMount } from "svelte";
  import stats from "../stats";

  import dialogStore, { DialogId } from "../dialogs";
  import HelpDialog from "./HelpDialog.svelte";
  import type Game from "../game/game";
  import { currentDayIndex } from "../currentDayIndex";

  export let game: Game;

  onMount(() => {
    // to check when page is visited after game finisehd
    if (game.status === "win" || game.status === "lose") {
      dialogStore.set(DialogId.Stats);
      // setTimeout(() => {
      //   dialogStore.set(DialogId.Stats);
      // }, 1400);
    }
    // Show help dialog if user's first time playing
    // i.e. no games won and no guesses made
    if (get(stats.numWins) === 0 && game.guesses.length === 0) {
      dialogStore.set(DialogId.Help);
    }
  });

  function generateDialogProps(id: DialogId, currDialogId: DialogId | null) {
    return {
      id: id,
      open: currDialogId === id,
      onClose: () => dialogStore.set(null),
      onOpen: () => dialogStore.set(id),
    };
  }
</script>

<header>
  <h1>Wordle #{currentDayIndex}</h1>
  <div class="buttons">
    <button
      type="button"
      aria-label="game instructions"
      data-a11y-dialog-show={DialogId.Help}
    >
      <ImgHelp />
    </button>
    <button
      type="button"
      aria-label="statistics"
      data-a11y-dialog-show={DialogId.Stats}
    >
      <ImgStats />
    </button>
    <button
      type="button"
      aria-label="settings"
      data-a11y-dialog-show={DialogId.Settings}
    >
      <ImgSetting />
    </button>
  </div>
  <SettingsDialog
    {...generateDialogProps(DialogId.Settings, $dialogStore)}
    {game}
  />
  <StatisticDialog
    {...generateDialogProps(DialogId.Stats, $dialogStore)}
    {game}
  />
  <HelpDialog {...generateDialogProps(DialogId.Help, $dialogStore)} />
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
