<script>
  import Dialog from "./Dialog.svelte";
  import statsStore, { numPlayed, numWins } from "./store/stats";

  $: maxCount = Math.max(
    ...Object.keys($statsStore)
      .filter((k) => k !== "fail")
      .map((k) => $statsStore[k])
  );
</script>

<Dialog id="stats-dialog" title="Statistics" titleId="statistic-dialog-title" on:instance>
  <div class="options-list">
    <div>Played: {$numPlayed}</div>
    <div>Win %: {Math.floor(($numWins * 100) / $numPlayed)}</div>
    <div class="guess-distribution">
      <p>Guess distribution</p>
      <ul class="distributions" role="list">
        {#each Object.entries($statsStore) as [guesses, count]}
          {#if guesses !== "fail"}
            <li>
              <span class="guesses">{guesses}</span>
              <div class="bar-container">
                <div class="bar" style={`width:${(100 * count) / maxCount}%`}>
                  <span class="count">{count}</span>
                </div>
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </div>
</Dialog>

<style>
  .options-list {
    display: flex;
    margin-top: 1.8rem;
    /* gap: 1.2rem; */
    flex-direction: column;
    height: 100%;
  }
  .guess-distribution {
    /* padding-inline: 30px; */
  }

  .distributions {
    list-style: none;
    display: grid;
    gap: 4px;
    padding-inline: 0;
  }
  .guesses {
    margin-right: 4px;
  }
  .distributions > li {
    display: flex;
    font-size: 0.8rem;
    font-weight: bold;
  }
  .distributions .bar-container {
    flex-grow: 1;
  }
  .distributions .bar {
    background-color: var(--clr-absent);
    color: white;
    min-width: 20px;
    display: flex;
    justify-content: flex-end;
    padding-right: 8px;
  }
</style>
