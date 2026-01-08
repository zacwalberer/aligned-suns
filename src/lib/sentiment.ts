import Sentiment from 'sentiment'
import type { RedditPost, SentimentResult } from '@/types/sentiment'

const sentimentAnalyzer = new Sentiment()

export function analyzeText(text: string): SentimentResult {
  const result = sentimentAnalyzer.analyze(text)
  return {
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative,
  }
}

export function analyzeRedditPosts(posts: RedditPost[]): number {
  if (posts.length === 0) {
    return 50 // Neutral default
  }

  let totalScore = 0
  let totalWeight = 0

  for (const post of posts) {
    const text = `${post.title} ${post.selftext}`
    const result = analyzeText(text)

    // Weight by engagement (upvotes + comments)
    const engagement = Math.log(Math.max(post.score, 1) + post.numComments + 1)
    totalScore += result.comparative * engagement
    totalWeight += engagement
  }

  const averageComparative = totalWeight > 0 ? totalScore / totalWeight : 0

  // Convert from comparative scale (-1 to 1 typical range) to 0-100 scale
  // comparative can exceed these bounds but we clamp to 0-100
  const normalizedScore = Math.min(100, Math.max(0, (averageComparative + 1) * 50))

  return Math.round(normalizedScore)
}
