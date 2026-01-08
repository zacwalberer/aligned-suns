import { NextRequest, NextResponse } from 'next/server'
import { getVoteByFingerprint, setVote, getRecentVotes } from '@/lib/kv'
import { VOTE_COOLDOWN_MS } from '@/constants/weights'
import type { VoteRequest, VoteResponse } from '@/types/vote'

export async function POST(
  request: NextRequest
): Promise<NextResponse<VoteResponse>> {
  try {
    const body = (await request.json()) as VoteRequest
    const { fingerprintId, value } = body

    // Validate fingerprint
    if (!fingerprintId || typeof fingerprintId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid fingerprint ID' },
        { status: 400 }
      )
    }

    // Validate vote value
    if (!value || value < 1 || value > 5) {
      return NextResponse.json(
        { success: false, message: 'Vote must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check cooldown
    const existingVote = await getVoteByFingerprint(fingerprintId)
    if (existingVote) {
      const lastVoteTime = new Date(existingVote.timestamp).getTime()
      const now = Date.now()

      if (now - lastVoteTime < VOTE_COOLDOWN_MS) {
        return NextResponse.json(
          { success: false, message: 'You can only vote once every 24 hours' },
          { status: 429 }
        )
      }
    }

    // Store the vote
    await setVote(fingerprintId, value)

    // Calculate new average for display
    const recentVotes = await getRecentVotes(Date.now() - VOTE_COOLDOWN_MS)
    const voteValues = recentVotes
      .map((v) => {
        const parts = v.split(':')
        return parseInt(parts[parts.length - 1], 10)
      })
      .filter((n) => !isNaN(n))

    const newAverage =
      voteValues.length > 0
        ? voteValues.reduce((sum, v) => sum + v, 0) / voteValues.length
        : value

    return NextResponse.json({
      success: true,
      message: 'Vote submitted successfully',
      newAverage: Math.round(((newAverage - 1) / 4) * 100),
    })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}
