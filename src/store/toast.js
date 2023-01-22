import { writable } from "svelte/store";

const TOAST_DURATION = 1500;

function toastStore() {
  let timeoutId;
  const { subscribe, set } = writable("", () => {
    return () => clearTimeout(timeoutId);
  });

  const setToast = (message, duration = TOAST_DURATION) => {
    set(message);
    clearTimeout(timeoutId);
    set(message);
    timeoutId = setTimeout(() => set(""), duration);
  };

  return {
    setToast,
    subscribe,
  };
}

const toast = toastStore();

export default toast;
