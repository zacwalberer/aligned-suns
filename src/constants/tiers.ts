import type { Tier, TierName } from '@/types/sentiment'

const PLACEHOLDER_IMAGE = '/images/01jyf05zh62d0z5a29v1.webp'

export const TIERS: Tier[] = [
  {
    name: 'aligned',
    displayName: 'Aligned',
    min: 90,
    max: 100,
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: 'nearly-aligned',
    displayName: 'Nearly Aligned',
    min: 70,
    max: 89,
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: 'skewed',
    displayName: 'Skewed',
    min: 50,
    max: 69,
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: 'pain',
    displayName: 'Pain',
    min: 30,
    max: 49,
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: '2-0-lead',
    displayName: '2-0 Lead',
    min: 20,
    max: 29,
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: 'dont-wanna-be-here',
    displayName: "I Don't Wanna Be Here",
    min: 0,
    max: 19,
    image: PLACEHOLDER_IMAGE,
  },
]

export function getTierByScore(score: number): Tier {
  const tier = TIERS.find((t) => score >= t.min && score <= t.max)
  return tier ?? TIERS[TIERS.length - 1]
}

export function getTierByName(name: TierName): Tier | undefined {
  return TIERS.find((t) => t.name === name)
}
