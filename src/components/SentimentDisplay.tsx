import Image from 'next/image'
import type { ReactElement } from 'react'
import { getTierByScore } from '@/constants/tiers'
import type { SentimentData } from '@/types/sentiment'

interface SentimentDisplayProps {
  data: SentimentData
}

export function SentimentDisplay({ data }: SentimentDisplayProps): ReactElement {
  const tier = getTierByScore(data.score)

  return (
    <div className="text-center">
      <Image
        src={tier.image}
        alt={tier.displayName}
        width={240}
        height={240}
        className="mx-auto rounded-lg mb-6"
      />
      <p className="font-serif text-2xl">{tier.displayName}</p>
    </div>
  )
}
