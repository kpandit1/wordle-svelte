import { onDestroy } from "svelte";
import { writable } from "svelte/store";

const TOAST_DURATION = 1500;

function toastStore() {
  const { subscribe, set } = writable("");
  let timeoutId;
  onDestroy(() => {
    clearTimeout(timeoutId);
  });

  const setToast = (message, duration = TOAST_DURATION) => {
    set(message);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => set(""), duration);
  };

  return {
    setToast,
    subscribe,
  };
}

export default toastStore;
