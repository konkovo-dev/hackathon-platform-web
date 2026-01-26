import type { HackathonContext } from '@/entities/hackathon-context/model/types'
import { allow, deny, type Decision } from '@/shared/policy/decision'

export function canCreateTeam(ctx: HackathonContext | null | undefined): Decision {
  if (!ctx) return deny('CONTEXT_REQUIRED')

  if (ctx.roles.length > 0 && ctx.particip.kind !== 'NONE') return deny('CONFLICT')
  if (ctx.stage !== 'REGISTRATION') return deny('STAGE_RULE')
  if (!ctx.policy.allow_team) return deny('POLICY_RULE')
  if (ctx.particip.kind === 'TEAM') return deny('LIMIT_RULE')

  return allow()
}
