declare module 'snoowrap' {
  interface SnoowrapOptions {
    userAgent: string
    clientId: string
    clientSecret: string
    refreshToken?: string
    accessToken?: string
    username?: string
    password?: string
  }

  interface Submission {
    id: string
    title: string
    selftext: string
    score: number
    num_comments: number
    subreddit: {
      display_name: string
    }
    created_utc: number
  }

  interface Subreddit {
    getNew(options?: { limit?: number }): Promise<Submission[]>
    getTop(options?: { time?: string; limit?: number }): Promise<Submission[]>
    getHot(options?: { limit?: number }): Promise<Submission[]>
  }

  class Snoowrap {
    constructor(options: SnoowrapOptions)
    getSubreddit(name: string): Subreddit
  }

  export default Snoowrap
}
