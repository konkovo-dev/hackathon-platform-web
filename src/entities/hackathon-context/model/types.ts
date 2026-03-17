export type HackathonStage =
  | 'DRAFT'
  | 'UPCOMING'
  | 'REGISTRATION'
  | 'PRESTART'
  | 'RUNNING'
  | 'JUDGING'
  | 'FINISHED'

export function normalizeHackathonStage(stage: string | undefined): HackathonStage {
  if (!stage) return 'DRAFT'
  if (stage.startsWith('HACKATHON_STAGE_')) {
    return stage.replace('HACKATHON_STAGE_', '') as HackathonStage
  }
  return stage as HackathonStage
}
