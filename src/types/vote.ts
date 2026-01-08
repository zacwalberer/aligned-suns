export type VoteValue = 1 | 2 | 3 | 4 | 5

export interface Vote {
  fingerprintId: string
  value: VoteValue
  timestamp: string
}

export interface VoteStatus {
  canVote: boolean
  lastVoteTime: string | null
  nextVoteTime: string | null
}

export interface VoteRequest {
  fingerprintId: string
  value: VoteValue
}

export interface VoteResponse {
  success: boolean
  message: string
  newAverage?: number
}
