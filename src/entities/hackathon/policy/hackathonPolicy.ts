import type { HackathonContext } from '@/entities/hackathon-context/model/types'
import { allow, deny, type Decision } from '@/shared/policy/decision'

export function canReadDraft(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')
  if (ctx.stage !== 'DRAFT') return deny('STAGE_RULE')
  if (!ctx.roles.includes('OWNER') && !ctx.roles.includes('ORGANIZER')) return deny('ROLE_REQUIRED')
  return allow()
}

export function canViewAnnouncements(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')
  
  const hasStaffRole = ctx.roles.length > 0
  const isParticipant = ctx.particip.kind !== 'NONE'
  
  if (hasStaffRole || isParticipant) {
    return allow()
  }
  
  return deny('ROLE_REQUIRED')
}
