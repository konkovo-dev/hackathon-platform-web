import { describe, it, expect } from 'vitest'
import { canCreateTeam } from './teamPolicy'
import type { HackathonContext } from '@/entities/hackathon-context/model/types'

describe('teamPolicy', () => {
  describe('canCreateTeam', () => {
    it('should allow creating team if auth and policy allows teams', () => {
      const ctx: HackathonContext = {
        hackathonId: 'hack-1',
        stage: 'REGISTRATION',
        roles: [],
        particip: { kind: 'NONE', team_id: null },
        policy: { allow_team: true, allow_individual: true },
      }

      const decision = canCreateTeam(ctx)
      expect(decision.allowed).toBe(true)
    })

    it('should deny if user is not authenticated', () => {
      const decision = canCreateTeam(null)
      expect(decision.allowed).toBe(false)
      if (!decision.allowed) {
        expect(decision.reason).toBe('CONTEXT_REQUIRED')
      }
    })

    it('should deny creating team if policy forbids teams', () => {
      const ctx: HackathonContext = {
        hackathonId: 'hack-1',
        stage: 'REGISTRATION',
        roles: [],
        particip: { kind: 'NONE', team_id: null },
        policy: { allow_team: false, allow_individual: true },
      }

      const decision = canCreateTeam(ctx)
      expect(decision.allowed).toBe(false)
      if (!decision.allowed) {
        expect(decision.reason).toBe('POLICY_RULE')
      }
    })

    it('should deny creating team outside registration stage', () => {
      const ctx: HackathonContext = {
        hackathonId: 'hack-1',
        stage: 'RUNNING',
        roles: [],
        particip: { kind: 'NONE', team_id: null },
        policy: { allow_team: true, allow_individual: true },
      }

      const decision = canCreateTeam(ctx)
      expect(decision.allowed).toBe(false)
      if (!decision.allowed) {
        expect(decision.reason).toBe('STAGE_RULE')
      }
    })

    it('should deny if already in a team', () => {
      const ctx: HackathonContext = {
        hackathonId: 'hack-1',
        stage: 'REGISTRATION',
        roles: [],
        particip: { kind: 'TEAM', team_id: 'team-1' },
        policy: { allow_team: true, allow_individual: true },
      }

      const decision = canCreateTeam(ctx)
      expect(decision.allowed).toBe(false)
      if (!decision.allowed) {
        expect(decision.reason).toBe('LIMIT_RULE')
      }
    })

    it('should deny if has role and already participating', () => {
      const ctx: HackathonContext = {
        hackathonId: 'hack-1',
        stage: 'REGISTRATION',
        roles: ['MENTOR'],
        particip: { kind: 'SINGLE', team_id: null },
        policy: { allow_team: true, allow_individual: true },
      }

      const decision = canCreateTeam(ctx)
      expect(decision.allowed).toBe(false)
      if (!decision.allowed) {
        expect(decision.reason).toBe('CONFLICT')
      }
    })
  })
})
