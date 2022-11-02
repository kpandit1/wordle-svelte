import { writable, derived } from "svelte/store";

const initialStats = {
  wins: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  fails: 0,
  currStreak: 0,
  maxStreak: 0,
};

function getStoredStats() {
  // TODO: add logic to update streak if day is missed.
  // Do this by storing some sort of a timestamp for the day that the win is registered in numWins
  // new Date().setHours(0, 0, 0, 0)
  // Compare to current date and see if there's a large gap
  return JSON.parse(localStorage.getItem("stats")) || initialStats;
}

const statsStore = writable(getStoredStats());

statsStore.subscribe((val) => {
  localStorage.setItem("stats", JSON.stringify(val));
});

export const addWin = (numGuesses) => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats.wins[numGuesses] = prevStats.wins[numGuesses] + 1;
    newStats.currStreak = prevStats.currStreak + 1;
    newStats.maxStreak = Math.max(newStats.currStreak, newStats.maxStreak);

    return newStats;
  });
};

export const addLoss = () => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats.fails = prevStats.fails + 1;
    newStats.currStreak = 0;

    return newStats;
  });
};

export const numPlayed = derived(statsStore, ($statsStore) => {
  const winCounts = Object.values($statsStore.wins);
  const totalWins = winCounts.reduce((acc, cnt) => acc + cnt, 0);
  const totalLosses = $statsStore.fails;

  return totalWins + totalLosses;
});

export const numWins = derived(statsStore, ($statsStore) => {
  const winCounts = Object.values($statsStore.wins);
  const totalWins = winCounts.reduce((acc, cnt) => acc + cnt, 0);

  return totalWins;
});

export default {
  subscribe: statsStore.subscribe,
};
