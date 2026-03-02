import { describe, it, expect } from 'vitest'
import { canReadDraft } from './hackathonPolicy'
import type { HackathonContext } from '@/entities/hackathon-context/model/types'

describe('canReadDraft', () => {
  it('should deny if context is null', () => {
    const decision = canReadDraft(null)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('CONTEXT_REQUIRED')
  })

  it('should deny if context is undefined', () => {
    const decision = canReadDraft(undefined)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('CONTEXT_REQUIRED')
  })

  it('should allow owner to read draft', () => {
    const ctx: HackathonContext = {
      stage: 'DRAFT',
      roles: ['OWNER'],
      particip: { kind: 'NONE' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow organizer to read draft', () => {
    const ctx: HackathonContext = {
      stage: 'DRAFT',
      roles: ['ORGANIZER'],
      particip: { kind: 'NONE' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should deny if stage is not draft', () => {
    const ctx: HackathonContext = {
      stage: 'REGISTRATION',
      roles: ['OWNER'],
      particip: { kind: 'NONE' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('STAGE_RULE')
  })

  it('should deny if user has no required role', () => {
    const ctx: HackathonContext = {
      stage: 'DRAFT',
      roles: [],
      particip: { kind: 'NONE' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('ROLE_REQUIRED')
  })

  it('should deny participant in draft stage', () => {
    const ctx: HackathonContext = {
      stage: 'DRAFT',
      roles: [],
      particip: { kind: 'INDIVIDUAL' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('ROLE_REQUIRED')
  })

  it('should deny if stage is running', () => {
    const ctx: HackathonContext = {
      stage: 'RUNNING',
      roles: ['OWNER'],
      particip: { kind: 'NONE' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe('STAGE_RULE')
  })

  it('should allow owner even if participates', () => {
    const ctx: HackathonContext = {
      stage: 'DRAFT',
      roles: ['OWNER'],
      particip: { kind: 'TEAM', teamId: 'team-1' },
      policy: {},
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(true)
  })
})
