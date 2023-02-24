import { readable } from "svelte/store";

function utilSecondsTillMidnight(): number {
  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const secondsUntilTomorrow = Math.floor(
    (tomorrow.getTime() - now.getTime()) / 1000
  );
  return secondsUntilTomorrow;
}

export const secondsTillMidnight = readable(
  utilSecondsTillMidnight(),
  function start(set) {
    const interval = setInterval(() => {
      set(utilSecondsTillMidnight());
    }, 1000);

    return function stop() {
      clearInterval(interval);
    };
  }
);
