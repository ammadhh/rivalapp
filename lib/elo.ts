/**
 * Elo Rating System Implementation
 * K-factor = 24 (standard for chess/competitive games)
 */

const K_FACTOR = 24

export interface EloUpdate {
  playerA: {
    oldRating: number
    newRating: number
    change: number
  }
  playerB: {
    oldRating: number
    newRating: number
    change: number
  }
}

/**
 * Calculate expected score for a player given their rating and opponent's rating
 * Returns a value between 0 and 1 representing the probability of winning
 */
function getExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

/**
 * Calculate new Elo ratings after a match
 * @param ratingA - Current rating of player A
 * @param ratingB - Current rating of player B
 * @param scoreA - Actual score for player A (1 = win, 0.5 = tie, 0 = loss)
 * @param scoreB - Actual score for player B (1 = win, 0.5 = tie, 0 = loss)
 * @returns New ratings for both players
 */
export function calculateEloUpdate(
  ratingA: number,
  ratingB: number,
  scoreA: number,
  scoreB: number
): EloUpdate {
  // Calculate expected scores
  const expectedA = getExpectedScore(ratingA, ratingB)
  const expectedB = getExpectedScore(ratingB, ratingA)

  // Calculate rating changes
  const changeA = K_FACTOR * (scoreA - expectedA)
  const changeB = K_FACTOR * (scoreB - expectedB)

  // Calculate new ratings
  const newRatingA = Math.round(ratingA + changeA)
  const newRatingB = Math.round(ratingB + changeB)

  return {
    playerA: {
      oldRating: ratingA,
      newRating: newRatingA,
      change: Math.round(changeA)
    },
    playerB: {
      oldRating: ratingB,
      newRating: newRatingB,
      change: Math.round(changeB)
    }
  }
}

/**
 * Convert vote result to Elo scores
 * @param result - Vote result ('LEFT', 'RIGHT', 'EQUAL', 'SKIP')
 * @returns Scores for left and right players [leftScore, rightScore]
 */
export function voteResultToScores(result: string): [number, number] {
  switch (result) {
    case 'LEFT':
      return [1, 0] // Left wins, Right loses
    case 'RIGHT':
      return [0, 1] // Right wins, Left loses
    case 'EQUAL':
      return [0.5, 0.5] // Tie
    case 'SKIP':
      return [0.5, 0.5] // No change (treat as tie)
    default:
      throw new Error(`Invalid vote result: ${result}`)
  }
}

/**
 * Calculate Elo updates from a vote result
 * @param leftRating - Current rating of left player
 * @param rightRating - Current rating of right player
 * @param voteResult - Vote result string
 * @returns Elo update object
 */
export function calculateEloFromVote(
  leftRating: number,
  rightRating: number,
  voteResult: string
): EloUpdate {
  const [leftScore, rightScore] = voteResultToScores(voteResult)
  return calculateEloUpdate(leftRating, rightRating, leftScore, rightScore)
}