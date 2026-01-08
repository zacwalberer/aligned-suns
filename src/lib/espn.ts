import type { ESPNTeamData, ESPNTeamRecord, ESPNInjury } from '@/types/espn'
import { SUNS_TEAM_ID } from '@/constants/weights'

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba'

interface ESPNTeamResponse {
  team: {
    id: string
    name: string
    abbreviation: string
    record?: {
      items?: Array<{
        summary: string
      }>
    }
  }
}

interface ESPNInjuriesResponse {
  items?: Array<{
    athlete: {
      id: string
      displayName: string
    }
    status: string
    type?: {
      description: string
    }
  }>
}

interface ESPNScoreboardResponse {
  events?: Array<{
    competitions?: Array<{
      competitors?: Array<{
        team: { id: string }
        winner?: boolean
      }>
    }>
  }>
}

export async function fetchSunsData(): Promise<ESPNTeamData> {
  try {
    // Fetch team info
    const teamResponse = await fetch(`${ESPN_BASE_URL}/teams/${SUNS_TEAM_ID}`, {
      next: { revalidate: 3600 },
    })

    if (!teamResponse.ok) {
      throw new Error(`ESPN team API error: ${teamResponse.status}`)
    }

    const teamData: ESPNTeamResponse = await teamResponse.json()

    // Parse record
    const recordSummary = teamData.team.record?.items?.[0]?.summary ?? '0-0'
    const [winsStr, lossesStr] = recordSummary.split('-')
    const wins = parseInt(winsStr, 10) || 0
    const losses = parseInt(lossesStr, 10) || 0
    const record: ESPNTeamRecord = {
      wins,
      losses,
      winPercentage: wins + losses > 0 ? wins / (wins + losses) : 0,
    }

    // Fetch injuries
    let injuries: ESPNInjury[] = []
    try {
      const injuriesResponse = await fetch(
        `https://sports.core.api.espn.com/v2/sports/basketball/nba/teams/${SUNS_TEAM_ID}/injuries`,
        { next: { revalidate: 3600 } }
      )
      if (injuriesResponse.ok) {
        const injuriesData: ESPNInjuriesResponse = await injuriesResponse.json()
        injuries = (injuriesData.items ?? []).map((injury) => ({
          playerId: injury.athlete.id,
          playerName: injury.athlete.displayName,
          status: injury.status as ESPNInjury['status'],
          injury: injury.type?.description ?? 'Unknown',
        }))
      }
    } catch (injuryError) {
      console.error('Error fetching injuries:', injuryError)
    }

    // Fetch recent games for last result
    let lastGameResult: 'W' | 'L' | null = null
    try {
      const scoreboardResponse = await fetch(`${ESPN_BASE_URL}/scoreboard`, {
        next: { revalidate: 300 },
      })
      if (scoreboardResponse.ok) {
        const scoreboardData: ESPNScoreboardResponse = await scoreboardResponse.json()
        for (const event of scoreboardData.events ?? []) {
          const sunsCompetitor = event.competitions?.[0]?.competitors?.find(
            (c) => c.team.id === SUNS_TEAM_ID
          )
          if (sunsCompetitor && sunsCompetitor.winner !== undefined) {
            lastGameResult = sunsCompetitor.winner ? 'W' : 'L'
            break
          }
        }
      }
    } catch (scoreboardError) {
      console.error('Error fetching scoreboard:', scoreboardError)
    }

    return {
      id: SUNS_TEAM_ID,
      name: 'Phoenix Suns',
      abbreviation: 'PHX',
      record,
      injuries,
      lastGameResult,
      streak: 0,
      streakType: null,
    }
  } catch (error) {
    console.error('Error fetching ESPN data:', error)
    // Return default data on error
    return {
      id: SUNS_TEAM_ID,
      name: 'Phoenix Suns',
      abbreviation: 'PHX',
      record: { wins: 0, losses: 0, winPercentage: 0 },
      injuries: [],
      lastGameResult: null,
      streak: 0,
      streakType: null,
    }
  }
}
