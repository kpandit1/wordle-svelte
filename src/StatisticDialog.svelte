<script lang="ts">
  import { GameStatus, LETTER_PLACEMENT } from "./global-enums";
  import { guesses, gameStatus, guessPlacements } from "./domain/game";
  import Dialog from "./Dialog.svelte";
  import statsStore, { numPlayed, numWins } from "./store/stats";
  import { dayNumber, NUM_GUESSES } from "../lib/constants/gameConstants";
  import toast from "./store/toast";
  import shareIcon from "./assets/share.svg";
  import { secondsTillMidnight } from "./store/secondsTillMidnight";

  function zeroPad(number: number): String {
    return String(number).padStart(2, "0");
  }

  function emojifiedGuesses(): string {
    const placementToEmoji = {
      [LETTER_PLACEMENT.CORRECT]: "🟩",
      [LETTER_PLACEMENT.PRESENT]: "🟨",
      [LETTER_PLACEMENT.ABSENT]: "⬛️",
    };

    const res = $guessPlacements.map((wordPlacements) =>
      wordPlacements.map((l) => placementToEmoji[l]).join("")
    );

    return res.join("\n");
  }

  function formatDuration(durationInSeconds: number) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return {
      hours: zeroPad(hours),
      minutes: zeroPad(minutes),
      seconds: zeroPad(seconds),
    };
  }

  function shareResults(): void {
    let body = `Wordle ${dayNumber} `;

    if ($gameStatus === GameStatus.WON) {
      body += `${$guesses.length}/${NUM_GUESSES}`;
    } else if ($gameStatus === GameStatus.LOST) {
      body += `X/${NUM_GUESSES}`;
    }
    body += "\n";
    body += emojifiedGuesses();

    navigator.clipboard.writeText(body);
    toast.setToast("Copied result to clipboard");
  }

  $: maxCount = Math.max(...Object.values($statsStore.wins));
  $: formattedDuration = formatDuration($secondsTillMidnight);
</script>

<Dialog
  id="stats-dialog"
  title="Statistics"
  titleId="statistic-dialog-title"
  on:instance
>
  <div class="options-list">
    <div>Played: {$numPlayed}</div>
    <!-- TODO: add check for numPlayed = 0-->
    <div>Win %: {Math.floor(($numWins * 100) / $numPlayed)}</div>
    <!-- <div>Current streak: {$statsStore.currStreak}</div>
    <div>Max streak: {$statsStore.maxStreak}</div> -->

    <div class="guess-distribution">
      <p>Guess distribution</p>
      <ul class="distributions">
        {#each Object.entries($statsStore.wins) as [guesses, count]}
          <li>
            <span class="guesses">{guesses}</span>
            <div class="bar-container">
              <div class="bar" style={`width:${(100 * count) / maxCount}%`}>
                <span class="count">{count}</span>
              </div>
            </div>
          </li>
        {/each}
      </ul>

      {#if $gameStatus !== GameStatus.IN_PROGRESS}
        <div>
          <p>Next Wordle:</p>
          <p>
            {formattedDuration.hours}:{formattedDuration.minutes}:{formattedDuration.seconds}
          </p>
        </div>
      {/if}
    </div>

    <!-- Only allow share after game is over -->
    {#if $gameStatus !== GameStatus.IN_PROGRESS}
      <button class="button" on:click={shareResults}>
        <span>Share</span>
        <img src={shareIcon} class="icon" role="presentation" alt="" />
      </button>
    {/if}
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
  .guess-distribution > p {
    text-align: center;
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
  .button {
    background-color: var(--clr-correct);
    color: white;
    font-weight: bold;
    font-size: 1rem;
    width: max-content;
    margin-inline: auto;
    padding: 0.7rem 1.75rem;
    border-radius: 100vw;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  .icon {
    width: 24px;
    height: 24px;
  }
</style>
