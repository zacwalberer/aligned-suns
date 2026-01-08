'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ReactElement } from 'react'
import type { Tier } from '@/types/sentiment'

interface TierImageProps {
  tier: Tier
  score: number
}

export function TierImage({ tier, score }: TierImageProps): ReactElement {
  // Calculate rotation based on score within tier
  const tierRange = tier.max - tier.min
  const positionInTier = tierRange > 0 ? (score - tier.min) / tierRange : 0.5
  const rotation = (positionInTier - 0.5) * 10 // -5 to +5 degrees

  return (
    <motion.div
      animate={{ rotateY: rotation, rotateX: rotation * 0.5 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
      className="relative w-64 h-64 mx-auto"
    >
      <Image
        src={tier.image}
        alt={tier.displayName}
        fill
        className="object-contain"
        priority
      />
    </motion.div>
  )
}
