import { writable, derived } from "svelte/store";
import { dayNumber } from "../lib/constants";
import type Game from "../refactor/game";

type Stats = {
  wins: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
  fails: number;
  currStreak: number;
  maxStreak: number;
  lastWonDayNumber: number;
};

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

function getStoredStats(): Stats {
  const storedVal = localStorage.getItem("stats");
  if (!storedVal) {
    return initialStats;
  }

  const parsedVal = JSON.parse(storedVal) as unknown;
  if (
    parsedVal !== null &&
    typeof parsedVal == "object" &&
    "wins" in parsedVal &&
    parsedVal.wins &&
    typeof parsedVal.wins === "object" &&
    "fails" in parsedVal &&
    typeof parsedVal.fails === "number" &&
    "currStreak" in parsedVal &&
    typeof parsedVal.currStreak === "number" &&
    "maxStreak" in parsedVal &&
    typeof parsedVal.maxStreak === "number" &&
    "lastWonDayNumber" in parsedVal &&
    typeof parsedVal.lastWonDayNumber === "number"
  ) {
    const storedStats: Stats = parsedVal as Stats;
    const previousDayNumber = dayNumber - 1;
    if (storedStats.lastWonDayNumber !== previousDayNumber) {
      storedStats.currStreak = 0;
    }
    return storedStats;
  } else {
    return initialStats;
  }
}

const statsStore = writable(getStoredStats());

statsStore.subscribe((val) => {
  localStorage.setItem("stats", JSON.stringify(val));
});

export const addWin = (numGuesses: number): void => {
  statsStore.update((prevStats) => {
    const newStats = { ...prevStats };
    newStats.wins[numGuesses] = prevStats.wins[numGuesses] + 1;
    newStats.currStreak = prevStats.currStreak + 1;
    newStats.maxStreak = Math.max(newStats.currStreak, newStats.maxStreak);
    newStats.lastWonDayNumber = dayNumber;

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
  } else {
    addLoss();
  }
}

export default {
  subscribe: statsStore.subscribe,
  addLoss,
  addWin,
  numPlayed,
  numWins,
  resetStreak,
  updateStats,
};
