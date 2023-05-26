<script lang="ts">
  import { fade } from "svelte/transition";
  import toast from "./store/toast";
</script>

<div class="toast-container">
  {#if $toast}
    <div class="toast" transition:fade={{ duration: 150 }}>
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
    padding: 8px 12px;
    background-color: var(--clr-text);
    color: var(--clr-background);
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: bold;
  }
</style>
