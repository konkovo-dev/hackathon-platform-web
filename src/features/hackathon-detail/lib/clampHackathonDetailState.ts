import type { HackathonDetailQueryState } from './hackathonDetailQuery'

export interface HackathonDetailClampContext {
  canManage: boolean
  canManageLoading: boolean
  isParticipant: boolean
  participationLoading: boolean
  canSeeTask: boolean
  canSeeAnnouncements: boolean
  canJudgeOrAssigned: boolean
  showSupportTab: boolean
  showManagementLeaderboardNav: boolean
  canAccessAboutResultsSection: boolean
  aboutResultsSectionLoading: boolean
  canReadResultDraft: boolean
  readResultDraftLoading: boolean
}

export function clampHackathonDetailState(
  state: HackathonDetailQueryState,
  ctx: HackathonDetailClampContext
): HackathonDetailQueryState {
  let { tab, section, org } = state

  if (tab === 'management' && !ctx.canManageLoading && !ctx.canManage) {
    return { tab: 'about', section: 'description', org: 'overview' }
  }
  if (tab === 'participation' && !ctx.participationLoading && !ctx.isParticipant) {
    return { tab: 'about', section: 'description', org: 'overview' }
  }
  if (tab === 'support' && !ctx.showSupportTab) {
    return { tab: 'about', section: 'description', org: 'overview' }
  }

  if (tab === 'judging') {
    if (ctx.canManage && !ctx.canJudgeOrAssigned) {
      return { tab: 'management', section: 'description', org: 'leaderboard' }
    }
    if (!ctx.canJudgeOrAssigned) {
      return { tab: 'about', section: 'description', org: 'overview' }
    }
  }

  if (tab === 'about') {
    if (section === 'task' && !ctx.canSeeTask) {
      section = 'description'
    }
    if (section === 'announcements' && !ctx.canSeeAnnouncements) {
      section = 'description'
    }
    if (
      section === 'results' &&
      !ctx.aboutResultsSectionLoading &&
      !ctx.canAccessAboutResultsSection
    ) {
      section = 'description'
    }
  }

  if (tab === 'management' && org === 'leaderboard' && !ctx.showManagementLeaderboardNav) {
    org = 'overview'
  }

  if (tab === 'management' && org === 'results') {
    if (ctx.readResultDraftLoading) {
    } else if (!ctx.canReadResultDraft) {
      org = 'overview'
    }
  }

  return { tab, section, org }
}
