/**
 * Each keyboard letter(a-z) can be assigned a placement
 * depending on placement feedback from previous guesses
 */

import type { WordPlacement } from "./game/game";

const letters =
  /* prettier-ignore */
  [
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x',
  'y', 'z'
] as const;

type Letter = (typeof letters)[number];

export default function getKeyboardLetterPlacements(
  guesses: readonly Word[],
  placements: readonly WordPlacement[]
): Record<Letter, LetterPlacement> {
  const ret = letters.reduce(
    (acc, letter) => ({
      ...acc,
      [letter]: "not_guessed",
    }),
    {} as Record<Letter, LetterPlacement>
  );

  const placementRanking: LetterPlacement[] = [
    "not_guessed",
    "absent",
    "present",
    "correct",
  ];
  for (let i = 0; i < guesses.length; i++) {
    for (let j = 0; j < guesses[i].length; j++) {
      const letter = guesses[i][j] as Letter;
      const placement = placements[i][j];
      const currPlacement = ret[letter];

      const placementRank = placementRanking.findIndex((p) => p === placement);
      const currPlacementRank = placementRanking.findIndex(
        (p) => p === currPlacement
      );

      if (placementRank > currPlacementRank) {
        ret[letter] = placement;
      }
    }
  }

  return ret;
}
