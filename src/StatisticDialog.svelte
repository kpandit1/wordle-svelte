<script lang="ts">
  import { guesses, gameStatus, guessPlacements } from "./domain/game";
  import Dialog from "./Dialog.svelte";
  import statsStore, { numPlayed, numWins } from "./store/stats";
  import { dayNumber, MAX_NUM_GUESSES } from "./lib/constants";
  import toast from "./store/toast";
  import shareIcon from "./assets/share.svg";
  import { secondsTillMidnight } from "./store/secondsTillMidnight";
  import { formatDuration } from "./lib/formatDuration";

  $: maxCount = Math.max(...Object.values($statsStore.wins));
  $: formattedDuration = formatDuration($secondsTillMidnight);

  function emojifiedGuesses(): string {
    const placementToEmoji = {
      correct: "🟩",
      present: "🟨",
      absent: "⬛️",
    };

    const res = $guessPlacements.map((wordPlacements) =>
      wordPlacements.map((l) => placementToEmoji[l]).join("")
    );

    return res.join("\n");
  }

  function shareResults(): void {
    let body = `Wordle ${dayNumber} `;

    if ($gameStatus === "win") {
      body += `${$guesses.length}/${MAX_NUM_GUESSES}`;
    } else if ($gameStatus === "lose") {
      body += `X/${MAX_NUM_GUESSES}`;
    }
    body += "\n";
    body += emojifiedGuesses();

    try {
      navigator.clipboard.writeText(body);
    } catch (err) {
      console.error("Error copying to clipboard", err);
      return;
    }
    toast.setToast("Copied result to clipboard");
  }

  // In the guess distribution chart, the number of guesses taken
  // to win the current game should be higlighted
  function shouldHighlightBar(numGuesses: number) {
    return $gameStatus === "win" && numGuesses === $guesses.length;
  }
</script>

<Dialog
  id="stats-dialog"
  title="Statistics"
  titleId="statistic-dialog-title"
  on:instance
>
  <div class="content">
    <div class="stats">
      <p>
        <span class="value">{$numPlayed}</span>
        <span class="label">Played</span>
      </p>
      <p>
        <span class="value"
          >{Math.round(($numWins * 100) / ($numPlayed || 0))}</span
        >
        <span class="label">Win %</span>
      </p>
      <p>
        <span class="value">{$statsStore.currStreak}</span>
        <span class="label">Current streak</span>
      </p>
      <p>
        <span class="value">{$statsStore.maxStreak}</span>
        <span class="label">Max streak</span>
      </p>
    </div>

    <div class="guess-distribution">
      <p style="font-weight:bold">Guess distribution</p>
      <ul class="distributions">
        {#each Object.entries($statsStore.wins) as [numGuesses, count]}
          <li>
            <span class="guesses">{numGuesses}</span>
            <div class="bar-container">
              <div
                class="bar"
                style={`width:${(100 * count) / maxCount}%`}
                class:highlight={shouldHighlightBar(Number(numGuesses))}
              >
                <span class="count">{count}</span>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    {#if $gameStatus !== "in_progress"}
      {@const { hours, minutes, seconds } = formattedDuration}
      <div class="extra">
        <div>
          <p>Next Wordle:</p>
          <p style="font-variant-numeric:initial">
            {hours}:{minutes}:{seconds}
          </p>
        </div>

        <button class="button" on:click={shareResults}>
          <span>Share</span>
          <img src={shareIcon} class="icon" role="presentation" alt="" />
        </button>
      </div>
    {/if}
  </div>
</Dialog>

<style>
  .content {
    display: flex;
    /* gap: 1.2rem; */
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  .guess-distribution {
    margin-block-start: 1rem;
    width: 80%;
  }
  .guess-distribution > p {
    text-align: center;
    /* padding-inline: 30px; */
  }

  .distributions {
    list-style: none;
    display: grid;
    gap: 4px;
    padding-inline: 0;
    margin-inline: auto;
    margin-block-start: 1em;
  }
  .guesses {
    margin-right: 4px;
  }
  .distributions > li {
    display: flex;
    font-size: 0.8rem;
    font-weight: bold;
  }
  .bar-container {
    flex-grow: 1;
  }
  .bar {
    background-color: var(--clr-absent);
    color: white;
    min-width: 20px;
    display: flex;
    justify-content: flex-end;
    padding-right: 8px;
  }
  .button {
    background-color: var(--clr-correct);
    color: white;
    font-weight: bold;
    font-size: 1rem;
    width: max-content;
    padding: 0.7rem 1.75rem;
    border-radius: 0.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  .icon {
    width: 24px;
    height: 24px;
  }
  .highlight {
    background-color: var(--clr-correct);
  }
  .stats {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .stats > p {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-inline: 0.5rem;
  }
  .stats .label {
    font-size: 0.8rem;
  }
  .stats .value {
    font-size: 2rem;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }
  .stats .value {
    font-size: 1.5rem;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }
  @media (min-width: 641px) {
    .stats .value {
      font-size: 2rem;
    }
  }
  .extra {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    margin-block-start: 1rem;
  }
  @media (min-width: 641px) {
    .extra {
      width: 80%;
    }
  }
</style>
