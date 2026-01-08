export const SENTIMENT_WEIGHTS = {
  reddit: 0.5,
  performance: 0.3,
  votes: 0.2,
} as const

export const VOTE_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours

export const SUBREDDITS = ['suns', 'nba', 'nbadiscussion'] as const

export const SUNS_TEAM_ID = '21' // ESPN team ID for Phoenix Suns

export const SUNS_KEYWORDS = [
  'suns',
  'phoenix',
  'booker',
  'durant',
  'beal',
  'devin',
  'kd',
  'phx',
] as const
