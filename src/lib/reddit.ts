import Snoowrap from 'snoowrap'
import type { RedditPost } from '@/types/sentiment'
import { SUBREDDITS, SUNS_KEYWORDS } from '@/constants/weights'

function createRedditClient(): Snoowrap {
  return new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT ?? 'SunsSentimentTracker/1.0.0',
    clientId: process.env.REDDIT_CLIENT_ID ?? '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET ?? '',
    refreshToken: process.env.REDDIT_REFRESH_TOKEN ?? '',
  })
}

function containsSunsKeyword(text: string): boolean {
  const lowerText = text.toLowerCase()
  return SUNS_KEYWORDS.some((keyword) => lowerText.includes(keyword))
}

export async function fetchSunsRelatedPosts(): Promise<RedditPost[]> {
  // Return mock data if Reddit credentials aren't configured
  if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
    console.log('Reddit API not configured, using mock data')
    return getMockRedditPosts()
  }

  const reddit = createRedditClient()
  const allPosts: RedditPost[] = []

  for (const subreddit of SUBREDDITS) {
    try {
      const posts = await reddit.getSubreddit(subreddit).getNew({ limit: 50 })

      const filteredPosts = posts
        .filter((post) => {
          const text = `${post.title} ${post.selftext}`
          return containsSunsKeyword(text)
        })
        .map((post) => ({
          id: post.id,
          title: post.title,
          selftext: post.selftext,
          score: post.score,
          numComments: post.num_comments,
          subreddit: post.subreddit.display_name,
          created: post.created_utc,
        }))

      allPosts.push(...filteredPosts)
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error)
    }
  }

  return allPosts
}

function getMockRedditPosts(): RedditPost[] {
  return [
    {
      id: 'mock1',
      title: 'Booker drops 40 in dominant Suns victory!',
      selftext: 'What a game from Devin Booker. The Suns looked incredible tonight.',
      score: 500,
      numComments: 200,
      subreddit: 'suns',
      created: Date.now() / 1000,
    },
    {
      id: 'mock2',
      title: 'KD and Booker chemistry is finally clicking',
      selftext: 'Durant and Booker are playing some beautiful basketball together.',
      score: 300,
      numComments: 150,
      subreddit: 'nba',
      created: Date.now() / 1000,
    },
    {
      id: 'mock3',
      title: 'Suns defense needs work',
      selftext: 'The Suns keep giving up too many points in the paint.',
      score: 100,
      numComments: 80,
      subreddit: 'suns',
      created: Date.now() / 1000,
    },
  ]
}
