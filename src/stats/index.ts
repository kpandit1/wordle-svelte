import { writable, derived } from "svelte/store";
import type Game from "../game/game";
import { currentDayIndex } from "../currentDayIndex";
import type { Stats } from "./types";
import { getStoredStats, storeStats } from "./storage";

const initialStats: Stats = {
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
  lastWonDayNumber: -1,
};

const statsStore = writable<Stats>(getStoredStats() || initialStats);

statsStore.subscribe((val) => {
  storeStats(val);
});

const addWin = (numGuesses: number): void => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats.wins[numGuesses] = prevStats.wins[numGuesses] + 1;
    newStats.currStreak = prevStats.currStreak + 1;
    newStats.maxStreak = Math.max(newStats.currStreak, newStats.maxStreak);
    newStats.lastWonDayNumber = currentDayIndex;

    return newStats;
  });
};

const resetStreak = (): void => {
  statsStore.update((prevStats) => ({ ...prevStats, currStreak: 0 }));
};

const addLoss = (): void => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats.fails = prevStats.fails + 1;
    newStats.currStreak = 0;

    return newStats;
  });
};

const numPlayed = derived(statsStore, ($statsStore) => {
  const winCounts = Object.values($statsStore.wins);
  const totalWins = winCounts.reduce((acc, cnt) => acc + cnt, 0);
  const totalLosses = $statsStore.fails;

  return totalWins + totalLosses;
});

const numWins = derived(statsStore, ($statsStore) => {
  const winCounts = Object.values($statsStore.wins);
  const totalWins = winCounts.reduce((acc, cnt) => acc + cnt, 0);

  return totalWins;
});

function updateStats(game: Game) {
  if (game.status === "win") {
    addWin(game.guesses.length);
  } else if (game.status === "lose") {
    addLoss();
  }
}

const modifiedStore = {
  subscribe: statsStore.subscribe,
  numPlayed,
  numWins,
  updateStats,
  resetStreak,
};

export default modifiedStore;
