import type { RedditPost } from '@/types/sentiment'

const USER_AGENT = 'valley-vibes-sentiment/1.0'
const RATE_LIMIT_DELAY_MS = 1000

interface RedditListing {
  data: {
    children: Array<{
      data: {
        id: string
        title: string
        selftext: string
        score: number
        num_comments: number
        subreddit: string
        created_utc: number
      }
    }>
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchRedditJson(url: string): Promise<RedditListing | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })

    if (!response.ok) {
      console.error(`Reddit fetch failed: ${response.status} for ${url}`)
      return null
    }

    return (await response.json()) as RedditListing
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

function parseRedditPosts(listing: RedditListing | null): RedditPost[] {
  if (!listing) {
    return []
  }

  const oneDayAgo = Date.now() / 1000 - 24 * 60 * 60

  return listing.data.children
    .filter((child) => child.data.created_utc >= oneDayAgo)
    .map((child) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext,
      score: child.data.score,
      numComments: child.data.num_comments,
      subreddit: child.data.subreddit,
      created: child.data.created_utc,
    }))
}

export async function fetchSunsRelatedPosts(): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = []
  const seenIds = new Set<string>()

  // Fetch r/suns hot posts
  const hotListing = await fetchRedditJson(
    'https://www.reddit.com/r/suns/hot.json?limit=50'
  )
  for (const post of parseRedditPosts(hotListing)) {
    if (!seenIds.has(post.id)) {
      seenIds.add(post.id)
      allPosts.push(post)
    }
  }

  await delay(RATE_LIMIT_DELAY_MS)

  // Fetch r/suns new posts
  const newListing = await fetchRedditJson(
    'https://www.reddit.com/r/suns/new.json?limit=50'
  )
  for (const post of parseRedditPosts(newListing)) {
    if (!seenIds.has(post.id)) {
      seenIds.add(post.id)
      allPosts.push(post)
    }
  }

  await delay(RATE_LIMIT_DELAY_MS)

  // Fetch Suns-related posts from r/nba
  const nbaListing = await fetchRedditJson(
    'https://www.reddit.com/r/nba/search.json?q=suns&sort=new&t=day&limit=50'
  )
  for (const post of parseRedditPosts(nbaListing)) {
    if (!seenIds.has(post.id)) {
      seenIds.add(post.id)
      allPosts.push(post)
    }
  }

  await delay(RATE_LIMIT_DELAY_MS)

  // Fetch Suns-related posts from r/nbadiscussion
  const discussionListing = await fetchRedditJson(
    'https://www.reddit.com/r/nbadiscussion/search.json?q=suns&sort=new&t=day&limit=50'
  )
  for (const post of parseRedditPosts(discussionListing)) {
    if (!seenIds.has(post.id)) {
      seenIds.add(post.id)
      allPosts.push(post)
    }
  }

  console.log(`Fetched ${allPosts.length} Suns-related posts from Reddit`)
  return allPosts
}
