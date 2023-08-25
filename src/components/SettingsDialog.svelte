<script lang="ts">
  import ToggleSwitch from "./ToggleSwitch.svelte";
  import Dialog from "./Dialog.svelte";
  import settings from "../settings";
  import type Game from "../game/game";
  import type { ComponentProps } from "svelte";

  type DialogProps = ComponentProps<Dialog>;

  export let id: DialogProps["id"];
  export let open: DialogProps["open"];
  export let onOpen: DialogProps["onOpen"];
  export let onClose: DialogProps["onClose"];
  export let game: Game;
</script>

<Dialog
  {id}
  {open}
  {onOpen}
  {onClose}
  title="⚙️ Settings"
  titleId="settings-dialog-title"
>
  <div class="options-list">
    <div class="option">
      <div class="option-label">
        <p class="title">Hard Mode</p>
        <p class="subtitle">
          Any revealed hints must be used in subsequent guesses
        </p>
      </div>
      <!-- Can't change mode mid-game -->
      <ToggleSwitch
        checked={$settings.hardMode}
        onClick={settings.toggleHardMode}
        disabled={game.status !== "not_started"}
      />
    </div>
    <div class="option">
      <div class="option-label">
        <p class="title">Dark Mode</p>
      </div>
      <ToggleSwitch
        checked={$settings.darkMode}
        onClick={settings.toggleDarkMode}
      />
    </div>
    <div class="option">
      <div class="option-label">
        <p class="title">High Contrast Mode</p>
        <p class="subtitle">For improved colour vision</p>
      </div>
      <ToggleSwitch
        checked={$settings.highContrast}
        onClick={settings.toggleContrast}
      />
    </div>
  </div>
</Dialog>

<style>
  .options-list {
    display: flex;
    /* gap: 1.2rem; */
    flex-direction: column;
    height: 100%;
  }
  .option {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid var(--clr-cell-border);

    padding-block: 12px;
  }
  .option:last-child {
    border-bottom: none;
  }

  .option-label > .title {
    font-size: 1.1rem;
    font-weight: 700;
  }
  .option-label > .subtitle {
    font-size: 0.9rem;
  }
</style>
