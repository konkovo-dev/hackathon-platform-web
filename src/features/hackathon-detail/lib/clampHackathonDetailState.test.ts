import { describe, it, expect } from 'vitest'
import { clampHackathonDetailState, type HackathonDetailClampContext } from './clampHackathonDetailState'

const baseCtx = (): HackathonDetailClampContext => ({
  canManage: false,
  canManageLoading: false,
  isParticipant: false,
  participationLoading: false,
  canSeeTask: false,
  canSeeAnnouncements: false,
  canJudgeOrAssigned: false,
  showSupportTab: false,
  showManagementLeaderboardNav: false,
  canAccessAboutResultsSection: false,
  aboutResultsSectionLoading: false,
  canReadResultDraft: false,
  readResultDraftLoading: false,
})

describe('clampHackathonDetailState', () => {
  it('does not redirect management to about while manage permission is loading', () => {
    const ctx = baseCtx()
    ctx.canManage = false
    ctx.canManageLoading = true

    expect(
      clampHackathonDetailState(
        { tab: 'management', section: 'description', org: 'overview' },
        ctx
      )
    ).toEqual({ tab: 'management', section: 'description', org: 'overview' })
  })

  it('redirects management to about when loaded and not allowed', () => {
    const ctx = baseCtx()
    ctx.canManage = false
    ctx.canManageLoading = false

    expect(
      clampHackathonDetailState(
        { tab: 'management', section: 'description', org: 'overview' },
        ctx
      )
    ).toEqual({ tab: 'about', section: 'description', org: 'overview' })
  })

  it('keeps management when allowed', () => {
    const ctx = baseCtx()
    ctx.canManage = true
    ctx.canManageLoading = false

    expect(
      clampHackathonDetailState(
        { tab: 'management', section: 'description', org: 'overview' },
        ctx
      )
    ).toEqual({ tab: 'management', section: 'description', org: 'overview' })
  })

  it('does not redirect participation to about while participation is loading', () => {
    const ctx = baseCtx()
    ctx.isParticipant = false
    ctx.participationLoading = true

    expect(
      clampHackathonDetailState(
        { tab: 'participation', section: 'description', org: 'overview' },
        ctx
      )
    ).toEqual({ tab: 'participation', section: 'description', org: 'overview' })
  })

  it('redirects participation to about when loaded and not a participant', () => {
    const ctx = baseCtx()
    ctx.isParticipant = false
    ctx.participationLoading = false

    expect(
      clampHackathonDetailState(
        { tab: 'participation', section: 'description', org: 'overview' },
        ctx
      )
    ).toEqual({ tab: 'about', section: 'description', org: 'overview' })
  })

  it('keeps participation when participant', () => {
    const ctx = baseCtx()
    ctx.isParticipant = true
    ctx.participationLoading = false

    expect(
      clampHackathonDetailState(
        { tab: 'participation', section: 'description', org: 'overview' },
        ctx
      )
    ).toEqual({ tab: 'participation', section: 'description', org: 'overview' })
  })

  it('keeps about section=results while about results permissions are loading', () => {
    const ctx = baseCtx()
    ctx.aboutResultsSectionLoading = true
    ctx.canAccessAboutResultsSection = false

    expect(
      clampHackathonDetailState({ tab: 'about', section: 'results', org: 'overview' }, ctx)
    ).toEqual({ tab: 'about', section: 'results', org: 'overview' })
  })

  it('redirects about section=results to description when not allowed', () => {
    const ctx = baseCtx()
    ctx.aboutResultsSectionLoading = false
    ctx.canAccessAboutResultsSection = false

    expect(
      clampHackathonDetailState({ tab: 'about', section: 'results', org: 'overview' }, ctx)
    ).toEqual({ tab: 'about', section: 'description', org: 'overview' })
  })

  it('keeps management org=results while readResultDraft is loading', () => {
    const ctx = baseCtx()
    ctx.canManage = true
    ctx.readResultDraftLoading = true
    ctx.canReadResultDraft = false

    expect(
      clampHackathonDetailState({ tab: 'management', section: 'description', org: 'results' }, ctx)
    ).toEqual({ tab: 'management', section: 'description', org: 'results' })
  })

  it('redirects management org=results to overview when not allowed', () => {
    const ctx = baseCtx()
    ctx.canManage = true
    ctx.readResultDraftLoading = false
    ctx.canReadResultDraft = false

    expect(
      clampHackathonDetailState({ tab: 'management', section: 'description', org: 'results' }, ctx)
    ).toEqual({ tab: 'management', section: 'description', org: 'overview' })
  })
})
