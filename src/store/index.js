import { writable } from "svelte/store";

const store = writable({
  // guesses: [...Array(6)].fill(''),
  guesses: ['', '', '', '', '', ''],
  guessIdx: 0,
  solution: "ROAST",
});

export default store;