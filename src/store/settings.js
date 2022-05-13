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
    update((state) => ({ ...state, darkMode: !state.darkMode }));
  }

  function toggleContrast() {
    update((state) => ({ ...state, highContrast: !state.highContrast }));
  }

  function toggleHardMode() {
    update((state) => ({ ...state, hardMode: !state.hardMode }));
  }

  return {
    subscribe,
    set,
    update,
    toggleDarkMode,
    toggleContrast,
    toggleHardMode,
  };
}

const settings = createStore();
settings.subscribe((val) => {
  // set up classes for dark and high contrast on load
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

  // sync with localstorage
  localStorage.setItem("settings", JSON.stringify(val));
});

export default settings;
