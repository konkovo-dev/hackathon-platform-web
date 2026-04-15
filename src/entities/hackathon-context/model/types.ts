export type HackathonStage =
  | 'DRAFT'
  | 'UPCOMING'
  | 'REGISTRATION'
  | 'PRESTART'
  | 'RUNNING'
  | 'JUDGING'
  | 'FINISHED'

const STAGE_FROM_PROTO_NUMBER: Record<number, HackathonStage> = {
  0: 'DRAFT',
  1: 'UPCOMING',
  2: 'REGISTRATION',
  3: 'PRESTART',
  4: 'RUNNING',
  5: 'JUDGING',
  6: 'FINISHED',
}

export function normalizeHackathonStage(stage: string | number | undefined | null): HackathonStage {
  if (stage === undefined || stage === null) return 'DRAFT'
  if (typeof stage === 'number') {
    return STAGE_FROM_PROTO_NUMBER[stage] ?? 'DRAFT'
  }
  if (typeof stage !== 'string' || stage === '') return 'DRAFT'

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
