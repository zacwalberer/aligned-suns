export interface ESPNTeamRecord {
  wins: number
  losses: number
  winPercentage: number
}

export interface ESPNInjury {
  playerId: string
  playerName: string
  status: 'Out' | 'Day-to-Day' | 'Questionable' | 'Probable'
  injury: string
}

export interface ESPNTeamData {
  id: string
  name: string
  abbreviation: string
  record: ESPNTeamRecord
  injuries: ESPNInjury[]
  lastGameResult: 'W' | 'L' | null
  streak: number
  streakType: 'W' | 'L' | null
}
