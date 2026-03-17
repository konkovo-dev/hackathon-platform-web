import { describe, it, expect } from 'vitest'
import { permissionToDecision } from './permissionToDecision'
import type { HackathonPermissionsBundle } from '@/entities/hackathon-permissions'

describe('permissionToDecision', () => {
  it('returns NOT_ALLOWED when permissions are null', () => {
    expect(permissionToDecision('Team.Create', null, { hackathonId: 'h1' }, null)).toEqual({
      allowed: false,
      reason: 'NOT_ALLOWED',
    })
    expect(permissionToDecision('Hackathon.ReadDraft', undefined, { hackathonId: 'h1' }, null)).toEqual({
      allowed: false,
      reason: 'NOT_ALLOWED',
    })
  })

  it('returns allowed when hackathon permission is true', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: { readDraft: true },
      participation: undefined,
      team: undefined,
      judging: undefined,
    }
    expect(permissionToDecision('Hackathon.ReadDraft', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: true,
    })
  })

  it('returns NOT_ALLOWED when hackathon permission is false', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: { readDraft: false },
      participation: undefined,
      team: undefined,
      judging: undefined,
    }
    expect(permissionToDecision('Hackathon.ReadDraft', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: false,
      reason: 'NOT_ALLOWED',
    })
  })

  it('returns allowed when participation.register is true', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: { register: true },
      team: undefined,
      judging: undefined,
    }
    expect(permissionToDecision('Participation.Register', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: true,
    })
  })

  it('returns allowed for Team.Create when team.createTeam is true', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: undefined,
      team: { createTeam: true },
      judging: undefined,
    }
    expect(permissionToDecision('Team.Create', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: true,
    })
  })

  it('returns ALREADY_IN_TEAM for Team.CanJoinTeam when myTeamId is set', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: { register: true },
      team: undefined,
      judging: undefined,
    }
    expect(permissionToDecision('Team.CanJoinTeam', perm, { hackathonId: 'h1' }, 'team-123')).toEqual({
      allowed: false,
      reason: 'ALREADY_IN_TEAM',
    })
  })

  it('returns allowed for Team.CanJoinTeam when register true and myTeamId null', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: { register: true },
      team: undefined,
      judging: undefined,
    }
    expect(permissionToDecision('Team.CanJoinTeam', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: true,
    })
  })

  it('returns NOT_ALLOWED for Team.EditTeam when teamId !== myTeamId', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: undefined,
      team: {
        createTeam: false,
        canInMyTeam: { editTeam: true },
      },
      judging: undefined,
    }
    expect(
      permissionToDecision('Team.EditTeam', perm, { hackathonId: 'h1', teamId: 'other-team' }, 'my-team')
    ).toEqual({ allowed: false, reason: 'NOT_ALLOWED' })
  })

  it('returns allowed for Team.EditTeam when canInMyTeam.editTeam and teamId === myTeamId', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: undefined,
      team: {
        createTeam: false,
        canInMyTeam: { editTeam: true },
      },
      judging: undefined,
    }
    expect(
      permissionToDecision('Team.EditTeam', perm, { hackathonId: 'h1', teamId: 'my-team' }, 'my-team')
    ).toEqual({ allowed: true })
  })

  it('returns NOT_ALLOWED for Judging when judging permissions missing', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: undefined,
      team: undefined,
      judging: undefined,
    }
    expect(permissionToDecision('Judging.ViewLeaderboard', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: false,
      reason: 'NOT_ALLOWED',
    })
  })

  it('returns allowed for Judging when permission is true', () => {
    const perm: HackathonPermissionsBundle = {
      hackathon: undefined,
      participation: undefined,
      team: undefined,
      judging: { viewLeaderboard: true },
    }
    expect(permissionToDecision('Judging.ViewLeaderboard', perm, { hackathonId: 'h1' }, null)).toEqual({
      allowed: true,
    })
  })
})
