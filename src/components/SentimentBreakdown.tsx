import type { ReactElement } from 'react'
import { Card } from '@/components/ui/Card'

interface SentimentBreakdownProps {
  redditScore: number
  performanceScore: number
  voteScore: number
}

export function SentimentBreakdown({
  redditScore,
  performanceScore,
  voteScore,
}: SentimentBreakdownProps): ReactElement {
  const items = [
    { label: 'Reddit Sentiment', value: redditScore, weight: '50%' },
    { label: 'Team Performance', value: performanceScore, weight: '30%' },
    { label: 'Fan Votes', value: voteScore, weight: '20%' },
  ]

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Score Breakdown</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">{item.label}</span>
              <span className="text-gray-300 text-sm">
                {item.value}%{' '}
                <span className="text-gray-500">({item.weight})</span>
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
              <div
                className="h-full bg-suns-orange rounded transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
