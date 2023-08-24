import { numDaysBetween } from "./common/daysBetween";

export const currentDayIndex = numDaysBetween(new Date(2021, 6, 2), new Date());
