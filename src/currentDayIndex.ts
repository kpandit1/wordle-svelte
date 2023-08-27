import { numDaysBetween } from "./common/daysBetween";

export let currentDayIndex = numDaysBetween(new Date(2021, 6, 2), new Date());

export function simulateNextDay() {
  currentDayIndex += 1;
}
