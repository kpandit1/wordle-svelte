import { get, writable } from "svelte/store";

function getStoredGuesses() {
  return JSON.parse(localStorage.getItem("guesses")) || [];
}

export const guesses = writable(getStoredGuesses());
export const currentGuess = writable("");

export const guessNextWord = (word) => {
  guesses.update((prevGuesses) => [...prevGuesses, word]);
};

export const clearState = () => {
  guesses.set([]);
};

guesses.subscribe((val) =>
  localStorage.setItem("guesses", JSON.stringify(val))
);

// export default store;
