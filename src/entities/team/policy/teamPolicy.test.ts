import { describe, it, expect } from 'vitest'
import { canCreateTeam } from './teamPolicy'
import type { HackathonContext } from '@/entities/hackathon-context/model/types'

describe('canCreateTeam', () => {
  it('should deny if context is null', () => {
    const decision = canCreateTeam(null)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('CONTEXT_REQUIRED')
  })

  it('should deny if context is undefined', () => {
    const decision = canCreateTeam(undefined)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('CONTEXT_REQUIRED')
  })

  it('should allow team creation during registration', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: [],
      particip: { kind: 'NONE' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should deny if user has role and participates', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: ['ORGANIZER'],
      particip: { kind: 'INDIVIDUAL' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('CONFLICT')
  })

  it('should allow if user has role but does not participate', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: ['ORGANIZER'],
      particip: { kind: 'NONE' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should deny if stage is not registration', () => {
    const ctx: HackathonContext = {
      stage: 'RUNNING',
      roles: [],
      particip: { kind: 'NONE' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('STAGE_RULE')
  })

  it('should deny if policy does not allow teams', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: [],
      particip: { kind: 'NONE' },
      policy: { allow_team: false },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('POLICY_RULE')
  })

  it('should deny if user already in team', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: [],
      particip: { kind: 'TEAM', teamId: 'team-1' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('LIMIT_RULE')
  })

  it('should allow if user participates as individual without role', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: [],
      particip: { kind: 'INDIVIDUAL' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should deny if user has multiple roles and participates', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: ['ORGANIZER', 'OWNER'],
      particip: { kind: 'TEAM', teamId: 'team-1' },
      policy: { allow_team: true },
    }

    const decision = canCreateTeam(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('CONFLICT')
  })
})
