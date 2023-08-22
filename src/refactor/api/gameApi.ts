const guessesKey = "guesses";
const solutionKey = "SOLUTION";

export function getStoredGuesses(): Word[] | undefined {
  const storedGuessesStr = localStorage.getItem(guessesKey);
  if (!storedGuessesStr) {
    return undefined;
  }

  const parsed: unknown = JSON.parse(storedGuessesStr);

  if (
    Array.isArray(parsed) &&
    parsed.every((item) => typeof item === "string")
  ) {
    return parsed;
  } else {
    return undefined;
  }
}

export function storeGuesses(guesses: readonly Word[]) {
  localStorage.setItem(guessesKey, JSON.stringify(guesses));
}

export function storeSolution(solution: Word) {
  localStorage.setItem(solutionKey, solution);
}

export function getStoredSolution(): Word | undefined {
  const storedSol = localStorage.getItem(solutionKey);
  return storedSol ?? undefined;
}
