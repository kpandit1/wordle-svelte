<script>
  import SvelteA11yDialog from "svelte-a11y-dialog";
  export let show;
  export let state;
</script>

<SvelteA11yDialog
  id="game-end-dialog"
  dialogRoot="#dialog-root"
  closeButtonPosition="first"
  title="Game End Dialog"
  titleId="dialog-title"
  role="dialog"
  on:instance
>
  <div class="options-list">
    <div>{show}</div>
    <div>{state}</div>
  </div>
</SvelteA11yDialog>

<style>
  :global(#game-end-dialog > .dialog-content) {
    width: min(100% - 2rem, 500px);
    position: relative;
    padding: 8px;
    margin-inline: auto;
    height: 100%;
    background-color: var(--clr-background);
    display: flex;
    flex-direction: column;
  }
  :global(#game-end-dialog > .dialog-overlay) {
    background-color: var(--clr-background);
  }
  :global(#game-end-dialog .dialog-close) {
    font-size: 1.5rem;
    margin-left: auto;
    min-width: 50px;
    background-color: transparent;
  }
  :global(#game-end-dialog .dialog-title) {
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
</style>
