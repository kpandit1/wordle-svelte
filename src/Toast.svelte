<script>
  import { fade } from "svelte/transition";
  import toastStore from "../src/store/toast";

  const toast = toastStore();
</script>

<div class="toast-container">
  {#if $toast}
    <div class="toast" transition:fade={{ duration: 300 }}>
      <span class="toast-text">{$toast}</span>
    </div>
  {/if}
</div>

<style>
  .toast-container {
    position: absolute;
    top: 0;
    width: 100%;

    z-index: 9999;
  }
  .toast {
    width: max-content;
    margin: auto;
    padding: 8px;
    background-color: var(--clr-text);
    color: var(--clr-background);
    border-radius: 4px;
    font-size: 11pt;
    font-weight: bold;
  }
</style>
