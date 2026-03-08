import type { HackathonStage } from '@/entities/hackathon-context/model/types'

export function getStageProgress(stage: HackathonStage): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const mapping: Record<HackathonStage, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
    DRAFT: 0,
    UPCOMING: 1,
    REGISTRATION: 2,
    PRESTART: 3,
    RUNNING: 4,
    JUDGING: 5,
    FINISHED: 6,
  }
  return mapping[stage] ?? 0
}

export function getStageLabel(stage: HackathonStage): string {
  const labels: Record<HackathonStage, string> = {
    DRAFT: 'draft',
    UPCOMING: 'upcoming',
    REGISTRATION: 'registration',
    PRESTART: 'prestart',
    RUNNING: 'running',
    JUDGING: 'judging',
    FINISHED: 'finished',
  }
  return labels[stage] ?? 'draft'
}
