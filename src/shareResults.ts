import { currentDayIndex } from "./currentDayIndex";
import type Game from "./game/game";
import { MAX_NUM_GUESSES } from "./game/gameConstants";

type LetterPlacement = "not_guessed" | "correct" | "present" | "absent";
function convertPlacementsToText(game: Game): string {
  const placementToEmoji: Partial<Record<LetterPlacement, string>> = {
    correct: "🟩",
    present: "🟨",
    absent: "⬛️",
  };

  const res = game.placements.map((wordPlacements) =>
    wordPlacements.map((l) => placementToEmoji[l]).join("")
  );

  return res.join("\n");
}

export function shareResults(game: Game): Promise<void> {
  let body = `Wordle ${currentDayIndex} `;

  if (game.status === "win") {
    body += `${game.guesses.length}/${MAX_NUM_GUESSES}`;
  } else if (game.status === "lose") {
    body += `X/${MAX_NUM_GUESSES}`;
  }
  body += "\n";
  body += convertPlacementsToText(game);
  return navigator.clipboard.writeText(body);
}
