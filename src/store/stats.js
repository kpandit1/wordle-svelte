import { writable, derived } from "svelte/store";

const initialStats = {
  // stats[i] stores number of wins with i guesses
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  fail: 0,
};

function getStoredStats() {
  return JSON.parse(localStorage.getItem("stats")) || initialStats;
}

const statsStore = writable(getStoredStats());

statsStore.subscribe((val) => {
  localStorage.setItem("stats", JSON.stringify(val));
});

export const addWin = (numGuesses) => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats[numGuesses] = prevStats[numGuesses] + 1;

    return newStats;
  });
};

export const addLoss = () => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats.fail = prevStats.fail + 1;

    return newStats;
  });
};

export const numPlayed = derived(statsStore, ($statsStore) => {
  const gameCounts = Object.values($statsStore);
  const totalGames = gameCounts.reduce((acc, cnt) => acc + cnt, 0);
  return totalGames;
});

export const numWins = derived(statsStore, ($statsStore) => {
  const numWins = Object.keys($statsStore)
    .filter((k) => k !== "fail")
    .map((k) => $statsStore[k])
    .reduce((acc, cnt) => acc + cnt, 0);

  return numWins;
});

export default {
  subscribe: statsStore.subscribe,
};
