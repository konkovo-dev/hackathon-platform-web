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

  const suffix = stage.startsWith('HACKATHON_STAGE_')
    ? stage.slice('HACKATHON_STAGE_'.length)
    : stage

  if (suffix === 'PRE_START') {
    return 'PRESTART'
  }
  if (suffix === 'UNSPECIFIED') {
    return 'DRAFT'
  }

  return suffix as HackathonStage
}
