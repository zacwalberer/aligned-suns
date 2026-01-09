export type TierName =
  | 'aligned'
  | 'nearly-aligned'
  | 'skewed'
  | 'pain'
  | '2-0-lead'
  | 'dont-wanna-be-here'

export interface Tier {
  name: TierName
  displayName: string
  min: number
  max: number
  image: string
}

export interface SentimentData {
  score: number
  redditScore: number
  performanceScore: number
  voteScore: number
  tier: TierName
  lastUpdated: string
}

export interface RedditPost {
  id: string
  title: string
  selftext: string
  score: number
  numComments: number
  subreddit: string
  created: number
}
