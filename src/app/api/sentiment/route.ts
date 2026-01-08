import { NextResponse } from 'next/server'
import { getSentiment } from '@/lib/kv'
import { getTierByScore } from '@/constants/tiers'
import type { SentimentData } from '@/types/sentiment'

export async function GET(): Promise<NextResponse<SentimentData>> {
  try {
    const stored = await getSentiment()

    if (!stored) {
      const defaultData: SentimentData = {
        score: 50,
        redditScore: 50,
        performanceScore: 50,
        voteScore: 50,
        tier: 'skewed',
        lastUpdated: new Date().toISOString(),
      }
      return NextResponse.json(defaultData)
    }

    const tier = getTierByScore(stored.score)

    return NextResponse.json({
      score: stored.score,
      redditScore: stored.redditScore,
      performanceScore: stored.performanceScore,
      voteScore: stored.voteScore,
      tier: tier.name,
      lastUpdated: stored.lastUpdated,
    })
  } catch (error) {
    console.error('Error fetching sentiment:', error)
    const errorData: SentimentData = {
      score: 50,
      redditScore: 50,
      performanceScore: 50,
      voteScore: 50,
      tier: 'skewed',
      lastUpdated: new Date().toISOString(),
    }
    return NextResponse.json(errorData, { status: 500 })
  }
}
