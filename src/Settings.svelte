<script>
  import ToggleSwitch from "./components/ToggleSwitch.svelte";
  import SvelteA11yDialog from "svelte-a11y-dialog";
  import { guesses } from "./store/game.js";
  import settings from "./store/settings";
</script>

<SvelteA11yDialog
  id="settings-dialog"
  dialogRoot="#dialog-root"
  closeButtonPosition="first"
  title="Settings"
  titleId="dialog-title"
  role="dialog"
>
  <div class="options-list">
    <div class="option">
      <div class="option-label">
        <p class="title">Hard Mode</p>
        <p class="subtitle">
          Any revealed hints must be used in subsequent guesses
        </p>
      </div>
      <ToggleSwitch
        checked={$settings.hardMode}
        onClick={settings.toggleHardMode}
        disabled={$guesses.length > 0}
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
    <!-- <button on:click={settings.toggleDarkMode}>☀️</button>
    <button on:click={settings.toggleContrast}>🌈</button>
    <button on:click={settings.toggleHardMode} disabled={$store.guessIdx > 0}>
      hard mode: {$settings.hardMode}
    </button>
    <ToggleSwitch checked={false}/>
    <ToggleSwitch checked={true}/> -->
  </div>
</SvelteA11yDialog>

<style>
  :global(#settings-dialog > .dialog-content) {
    width: min(100% - 2rem, 500px);
    position: relative;
    padding: 8px;
    margin-inline: auto;
    height: 100%;
    background-color: var(--clr-background);
    display: flex;
    flex-direction: column;
  }
  :global(#settings-dialog > .dialog-overlay) {
    background-color: var(--clr-background);
  }
  :global(#settings-dialog .dialog-close) {
    font-size: 1.5rem;
    margin-left: auto;
    min-width: 50px;
    background-color: transparent;
  }
  :global(#settings-dialog .dialog-title) {
    font-size: 1.4rem;
    font-weight: 700;
    text-align: center;
  }
  .options-list {
    display: flex;
    margin-top: 1.8rem;
    /* gap: 1.2rem; */
    flex-direction: column;
    height: 100%;
  }
  .option {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    padding-block: 12px;
  }
  .option-label > .title {
    font-size: 1.1rem;
    font-weight: 700;
  }
  .option-label > .subtitle {
    font-size: 0.9rem;
  }
</style>
