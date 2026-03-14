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
  
  if (ctx.stage === 'DRAFT') {
    return deny('STAGE_RULE')
  }
  
  const isStaff = ctx.roles.includes('OWNER') || 
    ctx.roles.includes('ORGANIZER') || 
    ctx.roles.includes('MENTOR') || 
    ctx.roles.includes('JURY')
  
  const isParticipant = ctx.particip.kind !== 'NONE'
  
  if (isStaff || isParticipant) {
    return allow()
  }
  
  return deny('ROLE_REQUIRED')
}

export function canManageHackathon(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')
  if (!ctx.roles.includes('OWNER') && !ctx.roles.includes('ORGANIZER')) {
    return deny('ROLE_REQUIRED')
  }
  return allow()
}

export function canPublishHackathon(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')
  if (ctx.stage !== 'DRAFT') return deny('STAGE_RULE')
  if (!ctx.roles.includes('OWNER') && !ctx.roles.includes('ORGANIZER')) {
    return deny('ROLE_REQUIRED')
  }
  return allow()
}

export function canCreateAnnouncement(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')
  if (!ctx.roles.includes('OWNER') && !ctx.roles.includes('ORGANIZER')) {
    return deny('ROLE_REQUIRED')
  }
  return allow()
}

export function canInviteStaff(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')
  if (!ctx.roles.includes('OWNER') && !ctx.roles.includes('ORGANIZER')) {
    return deny('ROLE_REQUIRED')
  }
  return allow()
}
