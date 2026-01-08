import type { Tier, TierName } from '@/types/sentiment'

export const TIERS: Tier[] = [
  {
    name: 'aligned',
    displayName: 'Aligned',
    min: 90,
    max: 100,
    image: '/images/tier-aligned.svg',
  },
  {
    name: 'nearly-aligned',
    displayName: 'Nearly Aligned',
    min: 70,
    max: 89,
    image: '/images/tier-nearly-aligned.svg',
  },
  {
    name: 'skewed',
    displayName: 'Skewed',
    min: 50,
    max: 69,
    image: '/images/tier-skewed.svg',
  },
  {
    name: 'pain',
    displayName: 'Pain',
    min: 30,
    max: 49,
    image: '/images/tier-pain.svg',
  },
  {
    name: '2-0-lead',
    displayName: '2-0 Lead',
    min: 20,
    max: 29,
    image: '/images/tier-2-0-lead.svg',
  },
  {
    name: 'dont-wanna-be-here',
    displayName: "I Don't Wanna Be Here",
    min: 0,
    max: 19,
    image: '/images/tier-dont-wanna.svg',
  },
]

export function getTierByScore(score: number): Tier {
  const tier = TIERS.find((t) => score >= t.min && score <= t.max)
  return tier ?? TIERS[TIERS.length - 1]
}

export function getTierByName(name: TierName): Tier | undefined {
  return TIERS.find((t) => t.name === name)
}
