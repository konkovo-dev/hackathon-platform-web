export type HackathonStage =
  | 'DRAFT'
  | 'UPCOMING'
  | 'REGISTRATION'
  | 'PRESTART'
  | 'RUNNING'
  | 'JUDGING'
  | 'FINISHED'

export type StaffRole = 'OWNER' | 'ORGANIZER' | 'MENTOR' | 'JURY'

export type ParticipationKind = 'NONE' | 'LOOKING_FOR_TEAM' | 'SINGLE' | 'TEAM'

export type HackathonPolicy = {
  allow_team: boolean
  allow_individual: boolean
  team_size_max?: number
}

export type HackathonParticipation = {
  kind: ParticipationKind
  team_id: string | null
}

export type HackathonContext = {
  hackathonId: string
  stage: HackathonStage
  policy: HackathonPolicy
  roles: StaffRole[]
  particip: HackathonParticipation
  result_published_at?: string | null
}

export function normalizeHackathonStage(stage: string | undefined): HackathonStage {
  if (!stage) return 'DRAFT'
  if (stage.startsWith('HACKATHON_STAGE_')) {
    return stage.replace('HACKATHON_STAGE_', '') as HackathonStage
  }
  return stage as HackathonStage
}
