<script lang="ts">
  // @ts-nocheck
  import SvelteA11yDialog from "svelte-a11y-dialog";

  export let id: string;
  export let title: string;
  export let titleId: string | undefined = undefined;
  export let open: boolean;
  export let onOpen: () => void;
  export let onClose: () => void;

  let elt: any = undefined;

  $: {
    if (elt) {
      if (open) {
        elt.show();
      } else {
        elt.hide();
      }
    }
  }

  function onInstance(e: any) {
    elt = e.detail.instance;
    elt.on("show", function (container: HTMLElement, event: Event) {
      onOpen();
    });
    elt.on("hide", function (container: HTMLElement, event: Event) {
      onClose();
    });
  }
</script>

<SvelteA11yDialog
  {id}
  dialogRoot="#dialog-root"
  closeButtonPosition="first"
  {title}
  {titleId}
  role="dialog"
  on:instance={onInstance}
>
  <slot />
</SvelteA11yDialog>

<style>
  :global(.dialog-container .dialog-content) {
    width: min(100% - 1.5rem, 500px);
    position: relative;
    padding-inline: 20px;
    padding-block: 16px;
    margin-inline: auto;
    background-color: var(--clr-background);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
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
  :global(.dialog-title) {
    margin-bottom: 1rem;
  }
</style>
