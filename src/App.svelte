<script>
  import Guesses from "./Guesses.svelte";
  import Keyboard from "./Keyboard.svelte";
  import settings from "../src/store/settings";
  import store from "./store/index.js";
  import  SvelteA11yDialog  from "svelte-a11y-dialog";

  let dialogInstance;
  const assignDialogInstance = (instance) => {
    dialogInstance = instance;
  };
</script>

<main>
  <div class="container">
    <header>
      <h1>Wordle</h1>
      <button on:click={settings.toggleDarkMode}>☀️</button>
      <button on:click={settings.toggleContrast}>🌈</button>
      <button on:click={settings.toggleHardMode} disabled={$store.guessIdx > 0}>
        hard mode: {$settings.hardMode}
      </button>
    </header>
    <Guesses />
    <Keyboard />
    <button type="button" data-a11y-dialog-show="a11y-dialog"
      >Open dialog</button
    >
    <SvelteA11yDialog
      id="a11y-dialog"
      dialogRoot="#dialog-root"
      closeButtonLabel="My close button label"
      closeButtonPosition="last"
      title="A11yDialog Test"
      titleId="uniqueTitleId"
      role="dialog"
      on:instance={assignDialogInstance}
    >
      <svelte:fragment slot="closeButtonContent">
        <span>Close</span>
      </svelte:fragment>
      <div>
        <p>This is some content</p>
      </div>
    </SvelteA11yDialog>
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
  }

  .container {
    width: min(100% - 2rem, 600px);
    margin-inline: auto;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  header > button {
    max-width: max-content;
    align-self: center;
  }

  h1 {
    font-size: 2rem;
    text-transform: uppercase;
  }
</style>
