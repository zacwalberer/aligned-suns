import vader from 'vader-sentiment'
import type { RedditPost } from '@/types/sentiment'

interface VaderScores {
  neg: number
  neu: number
  pos: number
  compound: number
}

export function analyzeText(text: string): VaderScores {
  return vader.SentimentIntensityAnalyzer.polarity_scores(
    text
  ) as VaderScores
}

export function analyzeRedditPosts(posts: RedditPost[]): number {
  if (posts.length === 0) {
    return 50 // Neutral default
  }

  let totalCompound = 0
  let totalWeight = 0

  for (const post of posts) {
    const text = `${post.title} ${post.selftext}`
    const scores = analyzeText(text)

    // Weight by engagement (upvotes + comments)
    const engagement = Math.log(Math.max(post.score, 1) + post.numComments + 1)
    totalCompound += scores.compound * engagement
    totalWeight += engagement
  }

  const averageCompound = totalWeight > 0 ? totalCompound / totalWeight : 0

  // Convert from compound scale (-1 to +1) to 0-100 scale
  const normalizedScore = ((averageCompound + 1) / 2) * 100

  return Math.round(Math.min(100, Math.max(0, normalizedScore)))
}
