import { get, writable } from "svelte/store";
import { dayNumber } from "../../lib/constants";
import { clearState } from "./game";

function getStoredDayNumber(): number {
  return (
    Number(JSON.parse(localStorage.getItem("lastPlayedDayNumber"))) || 999999
  );
}
export const lastPlayedDayNumber = writable(getStoredDayNumber());

lastPlayedDayNumber.subscribe((val) => {
  localStorage.setItem("lastPlayedDayNumber", String(val));
});

if (get(lastPlayedDayNumber) !== dayNumber) {
  // this ensures that previous guesses are reset between days
  clearState();
}
