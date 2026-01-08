import { kv } from '@vercel/kv'

const KEYS = {
  sentiment: 'sentiment:current',
  votes: 'votes:all',
  voteByFingerprint: (id: string) => `vote:${id}`,
} as const

export interface StoredSentiment {
  score: number
  redditScore: number
  performanceScore: number
  voteScore: number
  lastUpdated: string
}

interface StoredVote {
  value: number
  timestamp: string
}

// In-memory fallback for local development
const memoryStore: Map<string, unknown> = new Map()
const memorySortedSet: Map<string, { score: number; member: string }[]> = new Map()

function isKVConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function getSentiment(): Promise<StoredSentiment | null> {
  if (!isKVConfigured()) {
    return (memoryStore.get(KEYS.sentiment) as StoredSentiment) ?? null
  }
  return kv.get<StoredSentiment>(KEYS.sentiment)
}

export async function setSentiment(data: StoredSentiment): Promise<void> {
  if (!isKVConfigured()) {
    memoryStore.set(KEYS.sentiment, data)
    return
  }
  await kv.set(KEYS.sentiment, data)
}

export async function getVoteByFingerprint(
  fingerprintId: string
): Promise<StoredVote | null> {
  const key = KEYS.voteByFingerprint(fingerprintId)
  if (!isKVConfigured()) {
    return (memoryStore.get(key) as StoredVote) ?? null
  }
  return kv.get<StoredVote>(key)
}

export async function setVote(
  fingerprintId: string,
  value: number
): Promise<void> {
  const timestamp = new Date().toISOString()
  const key = KEYS.voteByFingerprint(fingerprintId)

  if (!isKVConfigured()) {
    memoryStore.set(key, { value, timestamp })
    const votes = memorySortedSet.get(KEYS.votes) ?? []
    votes.push({ score: Date.now(), member: `${fingerprintId}:${value}` })
    memorySortedSet.set(KEYS.votes, votes)
    return
  }

  await kv.set(key, { value, timestamp })
  await kv.zadd(KEYS.votes, { score: Date.now(), member: `${fingerprintId}:${value}` })
}

export async function getRecentVotes(since: number): Promise<string[]> {
  if (!isKVConfigured()) {
    const votes = memorySortedSet.get(KEYS.votes) ?? []
    return votes
      .filter((v) => v.score >= since)
      .map((v) => v.member)
  }
  // Use zrange with BYSCORE option for Vercel KV v3
  return kv.zrange(KEYS.votes, since, Date.now(), { byScore: true })
}

export { KEYS }
