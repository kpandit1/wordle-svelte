<script lang="ts">
  import Game from "./components/Game.svelte";
</script>

<main>
  <Game />
</main>

<style lang="postcss">
  main {
    width: min(100% - 1rem, 500px);
    margin-inline: auto;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
</style>
