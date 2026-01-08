import { NextRequest, NextResponse } from 'next/server'
import { getVoteByFingerprint } from '@/lib/kv'
import { VOTE_COOLDOWN_MS } from '@/constants/weights'
import type { VoteStatus } from '@/types/vote'

export async function GET(
  request: NextRequest
): Promise<NextResponse<VoteStatus>> {
  try {
    const fingerprintId = request.nextUrl.searchParams.get('fingerprintId')

    if (!fingerprintId) {
      return NextResponse.json({
        canVote: true,
        lastVoteTime: null,
        nextVoteTime: null,
      })
    }

    const existingVote = await getVoteByFingerprint(fingerprintId)

    if (!existingVote) {
      return NextResponse.json({
        canVote: true,
        lastVoteTime: null,
        nextVoteTime: null,
      })
    }

    const lastVoteTime = new Date(existingVote.timestamp).getTime()
    const now = Date.now()
    const timeSinceVote = now - lastVoteTime
    const canVote = timeSinceVote >= VOTE_COOLDOWN_MS

    return NextResponse.json({
      canVote,
      lastVoteTime: existingVote.timestamp,
      nextVoteTime: canVote
        ? null
        : new Date(lastVoteTime + VOTE_COOLDOWN_MS).toISOString(),
    })
  } catch (error) {
    console.error('Error checking vote status:', error)
    return NextResponse.json(
      { canVote: false, lastVoteTime: null, nextVoteTime: null },
      { status: 500 }
    )
  }
}
