import { NextRequest, NextResponse } from 'next/server'
import { fetchSunsRelatedPosts } from '@/lib/reddit'
import { fetchSunsData } from '@/lib/espn'
import { analyzeRedditPosts } from '@/lib/sentiment'
import {
  calculatePerformanceScore,
  calculateVoteScore,
  calculateAggregateScore,
} from '@/lib/calculateScore'
import { setSentiment, getRecentVotes } from '@/lib/kv'
import { VOTE_COOLDOWN_MS } from '@/constants/weights'

interface CronResponse {
  success: boolean
  data?: {
    score: number
    redditScore: number
    performanceScore: number
    voteScore: number
    tier: string
    lastUpdated: string
  }
  meta?: {
    redditPostsAnalyzed: number
    votesConsidered: number
    teamRecord: string
  }
  error?: string
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<CronResponse>> {
  // Verify cron secret in production
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  try {
    // Fetch Reddit data and analyze sentiment
    const redditPosts = await fetchSunsRelatedPosts()
    const redditScore = analyzeRedditPosts(redditPosts)

    // Fetch ESPN data and calculate performance score
    const teamData = await fetchSunsData()
    const performanceScore = calculatePerformanceScore(teamData)

    // Get recent votes and calculate vote score
    const recentVotes = await getRecentVotes(Date.now() - VOTE_COOLDOWN_MS)
    const voteValues = recentVotes
      .map((v) => {
        const parts = v.split(':')
        return parseInt(parts[parts.length - 1], 10)
      })
      .filter((n) => !isNaN(n))
    const voteScore = calculateVoteScore(voteValues)

    // Calculate aggregate score
    const sentimentData = calculateAggregateScore(
      redditScore,
      performanceScore,
      voteScore
    )

    // Store in KV
    await setSentiment({
      score: sentimentData.score,
      redditScore: sentimentData.redditScore,
      performanceScore: sentimentData.performanceScore,
      voteScore: sentimentData.voteScore,
      lastUpdated: sentimentData.lastUpdated,
    })

    return NextResponse.json({
      success: true,
      data: sentimentData,
      meta: {
        redditPostsAnalyzed: redditPosts.length,
        votesConsidered: voteValues.length,
        teamRecord: `${teamData.record.wins}-${teamData.record.losses}`,
      },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sentiment data' },
      { status: 500 }
    )
  }
}
