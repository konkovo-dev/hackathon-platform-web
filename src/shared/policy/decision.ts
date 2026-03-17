export type ReasonCode =
  | 'AUTH_REQUIRED'
  | 'NOT_ALLOWED'
  | 'ROLE_REQUIRED'
  | 'PARTICIP_REQUIRED'
  | 'STAGE_RULE'
  | 'POLICY_RULE'
  | 'OWNERSHIP_REQUIRED'
  | 'LIMIT_RULE'
  | 'CONFLICT'
  | 'CONTEXT_REQUIRED'
  | 'NOT_CAPTAIN'
  | 'HAS_MEMBERS'
  | 'CANNOT_KICK_SELF'
  | 'CANNOT_KICK_CAPTAIN'
  | 'NOT_MEMBER'
  | 'CAPTAIN_CANNOT_LEAVE'
  | 'NO_OTHER_MEMBERS'
  | 'ALREADY_IN_TEAM'
  | 'TEAM_NOT_JOINABLE'
  | 'NOT_STAFF'

export type Decision<R extends string = ReasonCode> =
  | { allowed: true }
  | { allowed: false; reason: R }

export const allow = (): Decision => ({ allowed: true })
export const deny = <R extends ReasonCode>(reason: R): Decision<R> => ({ allowed: false, reason })
