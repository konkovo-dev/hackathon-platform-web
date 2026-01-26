export type ReasonCode =
  | 'AUTH_REQUIRED'
  | 'ROLE_REQUIRED'
  | 'PARTICIP_REQUIRED'
  | 'STAGE_RULE'
  | 'POLICY_RULE'
  | 'OWNERSHIP_REQUIRED'
  | 'LIMIT_RULE'
  | 'CONFLICT'
  | 'CONTEXT_REQUIRED'

export type Decision<R extends string = ReasonCode> = { allowed: true } | { allowed: false; reason: R }

export const allow = (): Decision => ({ allowed: true })
export const deny = <R extends ReasonCode>(reason: R): Decision<R> => ({ allowed: false, reason })
