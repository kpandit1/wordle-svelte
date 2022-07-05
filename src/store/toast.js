import { writable } from "svelte/store";

const TOAST_DURATION = 1500;

function createStore() {
  const { subscribe, set } = writable("");

  const setToast = (message, duration = TOAST_DURATION) => {
    set(message);
    // clear message after TOAST_DURATION
    setTimeout(() => set(""), duration);
  };

  return {
    setToast,
    subscribe,
  };
}

const toast = createStore();

export default toast;
