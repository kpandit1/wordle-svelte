import { readable, writable } from "svelte/store";
import { daysBetween } from "../../lib/helpers";
import { SOLUTIONS } from "../../lib/constants";

const store = writable(
  JSON.parse(localStorage.getItem("store")) || {
    guesses: [...Array(6)].fill(""),
    guessIdx: 0,
  }
);

store.subscribe((val) => localStorage.setItem("store", JSON.stringify(val)));

export default store;
