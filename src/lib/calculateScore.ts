import { SENTIMENT_WEIGHTS } from '@/constants/weights'
import { getTierByScore } from '@/constants/tiers'
import type { SentimentData } from '@/types/sentiment'
import type { ESPNTeamData } from '@/types/espn'

export function calculatePerformanceScore(teamData: ESPNTeamData): number {
  let score = 50 // Start neutral

  // Win percentage contributes up to 40 points
  score += teamData.record.winPercentage * 40

  // Recent result: +10 for win, -10 for loss
  if (teamData.lastGameResult === 'W') {
    score += 10
  } else if (teamData.lastGameResult === 'L') {
    score -= 10
  }

  // Injury impact: -5 per key player out, capped at -20
  const playersOut = teamData.injuries.filter((i) => i.status === 'Out').length
  score -= Math.min(playersOut * 5, 20)

  return Math.min(100, Math.max(0, Math.round(score)))
}

export function calculateVoteScore(votes: number[]): number {
  if (votes.length === 0) {
    return 50 // Neutral default
  }

  const average = votes.reduce((sum, v) => sum + v, 0) / votes.length
  // Convert 1-5 scale to 0-100
  return Math.round(((average - 1) / 4) * 100)
}

export function calculateAggregateScore(
  redditScore: number,
  performanceScore: number,
  voteScore: number
): SentimentData {
  const score = Math.round(
    redditScore * SENTIMENT_WEIGHTS.reddit +
      performanceScore * SENTIMENT_WEIGHTS.performance +
      voteScore * SENTIMENT_WEIGHTS.votes
  )

  const tier = getTierByScore(score)

  return {
    score,
    redditScore,
    performanceScore,
    voteScore,
    tier: tier.name,
    lastUpdated: new Date().toISOString(),
  }
}
