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
    <main className="min-h-screen max-w-4xl mx-auto px-6 flex flex-col">
      <header className="pt-24 pb-16 text-center">
        <h1 className="font-serif text-5xl md:text-7xl italic tracking-tight">
          Are we aligned?
        </h1>
      </header>

      <section className="py-16">
        <SentimentDisplay data={sentimentData} />
      </section>

      <div className="flex-1" />

      <footer className="border-t border-gray-800 py-8 text-xs text-gray-600">
        <p>Updated daily at 4 AM MST</p>
      </footer>
    </main>
  )
}
