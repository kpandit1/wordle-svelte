<script>
  // @ts-nocheck
  export let id;
  export let title;
  export let titleId;

  import SvelteA11yDialog from "svelte-a11y-dialog";
</script>

<SvelteA11yDialog
  id={id}
  dialogRoot="#dialog-root"
  closeButtonPosition="first"
  title={title}
  titleId={titleId}
  role="dialog"
  on:instance
>
  <slot></slot>
</SvelteA11yDialog>

<style>
  :global(.dialog-container .dialog-content) {
    width: min(100% - 2rem, 500px);
    position: relative;
    padding-inline: 20px;
    padding-top: 16px;
    margin-inline: auto;
    background-color: var(--clr-background);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    min-height: 40%;
  }
  :global(.dialog-container .dialog-overlay) {
    opacity: 0.9;
  }
  :global(.dialog-container .dialog-close) {
    font-size: 1.3rem;
    line-height: 1.3rem;
    /* min-width: 50px; */
    background-color: transparent;
    position: absolute;
    top: 0;
    right: 0;
    margin: 8px;
    margin-top: 8px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
  }
  :global(.dialog-container .dialog-title) {
    font-size: 1.4rem;
    font-weight: 700;
    text-align: center;
  }
</style>
