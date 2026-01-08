import { SentimentDisplay } from '@/components/SentimentDisplay'
import type { SentimentData } from '@/types/sentiment'

async function getSentimentData(): Promise<SentimentData> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    const response = await fetch(`${baseUrl}/api/sentiment`, {
      next: { revalidate: 60 },
    })
    return response.json()
  } catch (error) {
    console.error('Error fetching sentiment data:', error)
    return {
      score: 50,
      redditScore: 50,
      performanceScore: 50,
      voteScore: 50,
      tier: 'skewed',
      lastUpdated: new Date().toISOString(),
    }
  }
}

export default async function HomePage(): Promise<React.ReactElement> {
  const sentimentData = await getSentimentData()

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Suns Sentiment Tracker
          </h1>
          <p className="text-gray-400">
            Real-time Phoenix Suns fan sentiment from Reddit, performance, and
            you.
          </p>
        </header>

        <SentimentDisplay data={sentimentData} />

        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Data updates daily at 4 AM MST</p>
        </footer>
      </div>
    </main>
  )
}
