import { daysBetween } from "../helpers";

export * from "./allWords";
export * from "./solutions";
export * from "./gameConstants";

// count the number of days since the start date
export const dayNumber = daysBetween(new Date(2021, 6, 1), new Date());
