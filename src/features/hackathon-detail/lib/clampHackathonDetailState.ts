import type { HackathonDetailQueryState } from './hackathonDetailQuery'

export interface HackathonDetailClampContext {
  canManage: boolean
  isParticipant: boolean
  canSeeTask: boolean
  canSeeAnnouncements: boolean
  canJudgeOrAssigned: boolean
  showSupportTab: boolean
  /** Лидерборд в «Управление»: заглушка true (Judging.ViewLeaderboard пока не используем), см. docs/hackathon-organizer-workspace.md §12 */
  showManagementLeaderboardNav: boolean
}

export function clampHackathonDetailState(
  state: HackathonDetailQueryState,
  ctx: HackathonDetailClampContext
): HackathonDetailQueryState {
  let { tab, section, org } = state

  if (tab === 'management' && !ctx.canManage) {
    return { tab: 'about', section: 'description', org: 'overview' }
  }
  if (tab === 'participation' && !ctx.isParticipant) {
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
  }

  if (tab === 'management' && org === 'leaderboard' && !ctx.showManagementLeaderboardNav) {
    org = 'overview'
  }

  return { tab, section, org }
}
