'use client'

import { useSessionQuery } from '@/features/auth/model/hooks'
import { useHackathonContextQuery } from '@/entities/hackathon-context/model/hooks'
import { canCreateTeam } from '@/entities/team/policy/teamPolicy'
import { canReadDraft } from '@/entities/hackathon/policy/hackathonPolicy'
import { deny, type Decision } from './decision'

export type Action = 
  | 'Session.Authenticated' 
  | 'Team.Create' 
  | 'Hackathon.ReadDraft'
  | 'Hackathon.ViewAnnouncements'
  | 'Hackathon.Create'

export type UseCanResult = {
  decision: Decision
  isLoading: boolean
}

export function useCan(action: Action, params?: { hackathonId?: string | null }): UseCanResult {
  const sessionQuery = useSessionQuery()
  const hackathonId = params?.hackathonId

  const needsHackathonContext = action === 'Team.Create' || action === 'Hackathon.ReadDraft'
  const ctxQuery = useHackathonContextQuery(needsHackathonContext ? hackathonId : undefined)

  const isLoading = sessionQuery.isLoading || (needsHackathonContext && ctxQuery.isLoading)

  if (action === 'Session.Authenticated') {
    if (sessionQuery.data?.active !== true) return { decision: deny('AUTH_REQUIRED'), isLoading }
    return { decision: { allowed: true }, isLoading }
  }

  if (sessionQuery.data?.active !== true) return { decision: deny('AUTH_REQUIRED'), isLoading }

  if (action === 'Team.Create') {
    return { decision: canCreateTeam(ctxQuery.data), isLoading }
  }

  if (action === 'Hackathon.ReadDraft') {
    return { decision: canReadDraft(ctxQuery.data), isLoading }
  }

  return { decision: deny('POLICY_RULE'), isLoading }
}
