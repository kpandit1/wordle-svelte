const STORAGE_KEY = "lastPlayedDayNumber";

export function getStoredLastPlayedDay(): number | undefined {
  return (
    Number(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")) || undefined
  );
}

export function storeLastPlayedDay(newNumber: Number) {
  localStorage.setItem(STORAGE_KEY, String(newNumber));
}
