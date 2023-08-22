import { onDestroy } from "svelte";
import { writable } from "svelte/store";

const TOAST_DURATION = 3500;

let timeoutId: NodeJS.Timeout;
function toastStore() {
  const { subscribe, set } = writable("", () => {
    return () => clearTimeout(timeoutId);
  });

  const setToast = (message: string, duration: number = TOAST_DURATION) => {
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
