'use client'

import { motion } from 'framer-motion'
import type { ReactElement } from 'react'
import { TierImage } from '@/components/TierImage'
import { SentimentBreakdown } from '@/components/SentimentBreakdown'
import { VotingPanel } from '@/components/VotingPanel'
import { Card } from '@/components/ui/Card'
import { getTierByScore } from '@/constants/tiers'
import type { SentimentData } from '@/types/sentiment'

interface SentimentDisplayProps {
  data: SentimentData
}

export function SentimentDisplay({ data }: SentimentDisplayProps): ReactElement {
  const tier = getTierByScore(data.score)

  return (
    <div className="flex flex-col items-center gap-8">
      <Card className="text-center w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-suns-orange mb-2">
            {data.score}%
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            {tier.displayName}
          </h2>
        </motion.div>

        <TierImage tier={tier} score={data.score} />

        <p className="text-gray-500 text-sm mt-4">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </Card>

      <div className="w-full max-w-md">
        <SentimentBreakdown
          redditScore={data.redditScore}
          performanceScore={data.performanceScore}
          voteScore={data.voteScore}
        />
      </div>

      <div className="w-full max-w-md">
        <VotingPanel />
      </div>
    </div>
  )
}
