import { currentDayIndex } from "../currentDayIndex";
import type { Stats } from "./types";

const STORAGE_KEY = "stats";

export function getStoredStats(): Stats | null {
  const storedVal = localStorage.getItem(STORAGE_KEY);
  if (!storedVal) {
    return null;
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
    const storedStats = parsedVal as Stats;

    if (currentDayIndex > storedStats.lastWonDayNumber) {
      storedStats.currStreak = 0;
    }
    return storedStats;
  } else {
    return null;
  }
}

export function storeStats(stats: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}
