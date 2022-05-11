import { writable } from "svelte/store";

function createStore() {
  const { subscribe, set, update } = writable(
    JSON.parse(localStorage.getItem("settings")) || {
      darkMode: false,
      highContrast: false,
      hardMode: false,
    }
  );

  function toggleDarkMode() {
    update((state) => {
      if (!state.darkMode) {
        return { ...state, darkMode: true };
      }
      return { ...state, darkMode: false };
    });
  }

  function toggleContrast() {
    update((state) => {
      if (!state.highContrast) {
        return { ...state, highContrast: true };
      }
      return { ...state, highContrast: false };
    });
  }

  return {
    subscribe,
    set,
    update,
    toggleDarkMode,
    toggleContrast,
  };
}

const settings = createStore();
settings.subscribe((val) => {
  // make sure things are correct on load
  if (val.darkMode) {
    document.body.classList.add("darkmode");
  } else {
    document.body.classList.remove("darkmode");
  }
  if (val.highContrast) {
    document.body.classList.add("contrast");
  } else {
    document.body.classList.remove("contrast");
  }
  localStorage.setItem("settings", JSON.stringify(val));
});

export default settings;
