function zeroPad(number: number): String {
  return String(number).padStart(2, "0");
}

export function formatDuration(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  return {
    hours: zeroPad(hours),
    minutes: zeroPad(minutes),
    seconds: zeroPad(seconds),
  };
}
