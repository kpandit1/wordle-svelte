import { writable } from "svelte/store";

function createStore() {
  const { subscribe, set, update } = writable(
    JSON.parse(localStorage.getItem("store")) || {
      guesses: [...Array(6)].fill(""),
      guessIdx: 0,
    }
  );

  function guessNextWord() {
    update((state) => ({ ...state, guessIdx: state.guessIdx + 1 }));
  }

  // for testing
  function clearState() {
    update((state) => ({
      ...state,
      guesses: [...Array(6)].fill(""),
      guessIdx: 0,
    }));
  }

  return {
    subscribe,
    set,
    update,
    guessNextWord,
    clearState,
  };
}

const store = createStore();
store.subscribe((val) => localStorage.setItem("store", JSON.stringify(val)));

export default store;
