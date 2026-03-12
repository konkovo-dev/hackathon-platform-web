import { describe, it, expect } from 'vitest'
import { canReadDraft, canViewAnnouncements } from './hackathonPolicy'
import type { HackathonContext } from '@/entities/hackathon-context/model/types'

describe('canReadDraft', () => {
  it('should deny if context is null', () => {
    const decision = canReadDraft(null)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('CONTEXT_REQUIRED')
    }
  })

  it('should deny if context is undefined', () => {
    const decision = canReadDraft(undefined)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('CONTEXT_REQUIRED')
    }
  })

  it('should allow owner to read draft', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'DRAFT',
      roles: ['OWNER'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow organizer to read draft', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'DRAFT',
      roles: ['ORGANIZER'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should deny if stage is not draft', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'REGISTRATION',
      roles: ['OWNER'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('STAGE_RULE')
    }
  })

  it('should deny if user has no required role', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'DRAFT',
      roles: [],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('ROLE_REQUIRED')
    }
  })

  it('should deny participant in draft stage', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'DRAFT',
      roles: [],
      particip: { kind: 'SINGLE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('ROLE_REQUIRED')
    }
  })

  it('should deny if stage is running', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: ['OWNER'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('STAGE_RULE')
    }
  })

  it('should allow owner even if participates', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'DRAFT',
      roles: ['OWNER'],
      particip: { kind: 'TEAM', team_id: 'team-1' },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canReadDraft(ctx)
    expect(decision.allowed).toBe(true)
  })
})

describe('canViewAnnouncements', () => {
  it('should deny if context is null', () => {
    const decision = canViewAnnouncements(null)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('CONTEXT_REQUIRED')
    }
  })

  it('should deny if context is undefined', () => {
    const decision = canViewAnnouncements(undefined)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('CONTEXT_REQUIRED')
    }
  })

  it('should allow owner to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: ['OWNER'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow organizer to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: ['ORGANIZER'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow mentor to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: ['MENTOR'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow jury to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'JUDGING',
      roles: ['JURY'],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow single participant to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: [],
      particip: { kind: 'SINGLE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow team participant to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: [],
      particip: { kind: 'TEAM', team_id: 'team-1' },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should allow looking for team participant to view announcements', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'PRESTART',
      roles: [],
      particip: { kind: 'LOOKING_FOR_TEAM', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })

  it('should deny non-participant without roles', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: [],
      particip: { kind: 'NONE', team_id: null },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(false)
    if (!decision.allowed) {
      expect(decision.reason).toBe('ROLE_REQUIRED')
    }
  })

  it('should allow staff with participant status', () => {
    const ctx: HackathonContext = {
      hackathonId: 'hack-1',
      stage: 'RUNNING',
      roles: ['ORGANIZER'],
      particip: { kind: 'TEAM', team_id: 'team-1' },
      policy: { allow_team: true, allow_individual: true },
    }

    const decision = canViewAnnouncements(ctx)
    expect(decision.allowed).toBe(true)
  })
})
