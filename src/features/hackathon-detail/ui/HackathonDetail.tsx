'use client'

import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Breadcrumb, Tabs, type Tab } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { useCan } from '@/shared/policy/useCan'
import {
  useHackathonDetailQuery,
  useHackathonAnnouncementsQuery,
  useHackathonTaskQuery,
} from '../model/hooks'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { HackathonDetailInfo } from './HackathonDetailInfo'
import { MyParticipationTabContent } from './MyParticipationTabContent'
import { TaskTabContent } from './TaskTabContent'
import { AnnouncementsList } from './AnnouncementsList'
import { HackathonManagementDashboard } from '@/widgets/hackathon-management-dashboard/ui/HackathonManagementDashboard'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { useSupportMentorAccessQuery } from '@/features/mentor-support/model/hooks'
import { SupportTabContent } from '@/features/mentor-support/ui/SupportTabContent'
import { JudgingTabContent } from '@/features/judging/ui/JudgingTabContent'
import { OrganizerParticipantsTabContent } from './OrganizerParticipantsTabContent'
import { OrganizerJudgingStatusSection } from '@/features/judging/ui/OrganizerJudgingStatusSection'
import { PublicResultSection } from '@/features/result/ui/PublicResultSection'
import { OrganizerResultSection } from '@/features/result/ui/OrganizerResultSection'
import { useHackathonsByRoleQuery } from '@/entities/hackathon/model/useHackathonsByRoleQuery'
import { cn } from '@/shared/lib/cn'
import {
  parseHackathonDetailSearchParams,
  hackathonDetailPathOptionsFromState,
  serializeHackathonDetailUrlFromProps,
  type HackathonDetailQueryState,
  type HackathonDetailTopTab,
} from '../lib/hackathonDetailQuery'
import { clampHackathonDetailState } from '../lib/clampHackathonDetailState'
import { HackathonDetailSubnav } from './HackathonDetailSubnav'

export interface HackathonDetailProps {
  hackathonId: string
  initialData?: Hackathon
  /** query tab= (включая legacy значения на входе) */
  tab?: string | null
  section?: string | null
  org?: string | null
}

function buildSearchParamsFromProps(
  tab?: string | null,
  section?: string | null,
  org?: string | null
): URLSearchParams {
  const sp = new URLSearchParams()
  if (tab) sp.set('tab', tab)
  if (section) sp.set('section', section)
  if (org) sp.set('org', org)
  return sp
}

export function HackathonDetail({
  hackathonId,
  initialData,
  tab: tabProp,
  section: sectionProp,
  org: orgProp,
}: HackathonDetailProps) {
  const t = useT()
  const router = useRouter()
  const { data: hackathon, isLoading, error } = useHackathonDetailQuery(hackathonId, initialData)

  const { decision: canViewAnnouncementsDecision } = useCan('Hackathon.ViewAnnouncements', {
    hackathonId,
  })
  const canSeeAnnouncements = canViewAnnouncementsDecision.allowed

  const { decision: canReadTaskDecision } = useCan('Hackathon.ReadTask', { hackathonId })
  const canSeeTask = canReadTaskDecision.allowed

  const { decision: canManageDecision, isLoading: canManageLoading } = useCan('Hackathon.Manage', {
    hackathonId,
  })
  const canManage = canManageDecision.allowed

  const { decision: canJudgeDecision } = useCan('Judging.ViewMyJudgingAssignments', {
    hackathonId,
  })
  const canJudge = canJudgeDecision.allowed

  const { decision: canViewLeaderboardDecision, isLoading: canViewLeaderboardLoading } = useCan(
    'Judging.ViewLeaderboard',
    {
      hackathonId,
    }
  )

  const { decision: canReadResultDraftDecision, isLoading: readResultDraftLoading } = useCan(
    'Hackathon.ReadResultDraft',
    { hackathonId }
  )
  const { decision: canUpdateResultDraftDecision } = useCan('Hackathon.UpdateResultDraft', {
    hackathonId,
  })
  const { decision: canPublishResultDecision } = useCan('Hackathon.PublishResult', {
    hackathonId,
  })
  const { decision: canViewResultPublicDecision, isLoading: viewResultPublicLoading } = useCan(
    'Hackathon.ViewResultPublic',
    { hackathonId }
  )

  const { data: session } = useSessionQuery()
  const sessionActive = Boolean(session && session.active)
  const judgeRoleQuery = useHackathonsByRoleQuery('judge', {
    enabled: sessionActive && Boolean(hackathonId),
  })
  const isJudgeByRoleList = useMemo(
    () => judgeRoleQuery.data?.hackathons.some(h => h.hackathonId === hackathonId) ?? false,
    [hackathonId, judgeRoleQuery.data?.hackathons]
  )
  const canJudgeOrAssigned = canJudge || isJudgeByRoleList
  const showJudgingTab = canJudgeOrAssigned

  const showManagementLeaderboardNav =
    canManage &&
    !canViewLeaderboardLoading &&
    canViewLeaderboardDecision.allowed

  const myParticipationQuery = useMyParticipationQuery(hackathonId)
  const myTeamId = myParticipationQuery.data?.teamId ?? null
  const participationStatus = myParticipationQuery.data?.status ?? null
  const isParticipant =
    myTeamId != null ||
    (participationStatus != null &&
      participationStatus !== 'PART_NONE' &&
      participationStatus !== 'PARTICIPATION_STATUS_UNSPECIFIED')

  const { data: announcements = [], isLoading: isLoadingAnnouncements } =
    useHackathonAnnouncementsQuery(canSeeAnnouncements ? hackathonId : null)

  const { data: task, isLoading: isLoadingTask } = useHackathonTaskQuery(
    canSeeTask ? hackathonId : null,
    canSeeTask
  )

  const isRunning = hackathon?.stage === 'RUNNING'
  const mentorProbeEnabled = Boolean(hackathonId) && isRunning && !canManage && sessionActive
  const { data: hasMentorAccess } = useSupportMentorAccessQuery(hackathonId, {
    enabled: mentorProbeEnabled,
  })
  const showSupportTab =
    Boolean(hackathon) && isRunning && (isParticipant || canManage || hasMentorAccess === true)

  const urlSearchParams = useMemo(
    () => buildSearchParamsFromProps(tabProp, sectionProp, orgProp),
    [tabProp, sectionProp, orgProp]
  )

  const { state: parsedState } = useMemo(
    () => parseHackathonDetailSearchParams(hackathonId, urlSearchParams),
    [hackathonId, urlSearchParams]
  )

  const participationLoading = myParticipationQuery.isLoading

  const resultPublished = Boolean(hackathon?.resultPublishedAt)
  const canReadResultDraft = canReadResultDraftDecision.allowed
  const canViewResultPublic = canViewResultPublicDecision.allowed
  const canAccessAboutResultsSection =
    sessionActive && (canReadResultDraft || (resultPublished && canViewResultPublic))
  const aboutResultsSectionLoading =
    (sessionActive &&
      parsedState.tab === 'about' &&
      parsedState.section === 'results' &&
      hackathon == null &&
      isLoading) ||
    (sessionActive && readResultDraftLoading) ||
    (sessionActive && resultPublished && viewResultPublicLoading)

  const showAboutResultsNav =
    (sessionActive && canReadResultDraft) ||
    (sessionActive && canManage && readResultDraftLoading) ||
    (sessionActive && resultPublished && canViewResultPublic) ||
    (sessionActive && resultPublished && viewResultPublicLoading)
  const showManagementResultsNav = canManage && !readResultDraftLoading && canReadResultDraft

  const clampContext = useMemo(
    () => ({
      canManage,
      canManageLoading,
      isParticipant,
      participationLoading,
      canSeeTask,
      canSeeAnnouncements,
      canJudgeOrAssigned,
      showSupportTab,
      showManagementLeaderboardNav,
      canAccessAboutResultsSection,
      aboutResultsSectionLoading,
      canReadResultDraft,
      readResultDraftLoading,
    }),
    [
      canManage,
      canManageLoading,
      isParticipant,
      participationLoading,
      canSeeTask,
      canSeeAnnouncements,
      canJudgeOrAssigned,
      showSupportTab,
      showManagementLeaderboardNav,
      canAccessAboutResultsSection,
      aboutResultsSectionLoading,
      canReadResultDraft,
      readResultDraftLoading,
    ]
  )

  const displayState: HackathonDetailQueryState = useMemo(
    () => clampHackathonDetailState(parsedState, clampContext),
    [parsedState, clampContext]
  )

  const canonicalHref = useMemo(
    () =>
      routes.hackathons.hackathonDetailPath(
        hackathonId,
        hackathonDetailPathOptionsFromState(displayState)
      ),
    [hackathonId, displayState]
  )

  const rawHref = useMemo(
    () => serializeHackathonDetailUrlFromProps(hackathonId, tabProp, sectionProp, orgProp),
    [hackathonId, tabProp, sectionProp, orgProp]
  )

  useEffect(() => {
    if (canonicalHref !== rawHref) {
      router.replace(canonicalHref)
    }
  }, [canonicalHref, rawHref, router])

  const tabs: Tab<HackathonDetailTopTab>[] = useMemo(() => {
    const out: Tab<HackathonDetailTopTab>[] = [
      {
        id: 'about',
        label: t('hackathons.detail.tabs.about'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'about' }),
      },
    ]
    if (isParticipant) {
      out.push({
        id: 'participation',
        label: t('hackathons.detail.tabs.participation'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'participation' }),
      })
    }
    if (canManage) {
      out.push({
        id: 'management',
        label: t('hackathons.detail.tabs.management'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'management' }),
      })
    }
    if (showSupportTab) {
      out.push({
        id: 'support',
        label: t('hackathons.detail.tabs.support'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'support' }),
      })
    }
    if (showJudgingTab) {
      out.push({
        id: 'judging',
        label: t('hackathons.detail.tabs.judging'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'judging' }),
      })
    }
    return out
  }, [hackathonId, isParticipant, canManage, showSupportTab, showJudgingTab, t])

  const tabIds = useMemo(() => tabs.map(tab => tab.id), [tabs])
  const activeTopTab: HackathonDetailTopTab = tabIds.includes(displayState.tab)
    ? displayState.tab
    : 'about'

  const aboutNavItems = useMemo(() => {
    const items: { id: HackathonDetailQueryState['section']; label: string; href: string }[] = [
      {
        id: 'description',
        label: t('hackathons.detail.tabs.description'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'about',
          section: 'description',
        }),
      },
    ]
    if (canSeeTask) {
      items.push({
        id: 'task',
        label: t('hackathons.detail.tabs.task'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'about', section: 'task' }),
      })
    }
    if (canSeeAnnouncements) {
      items.push({
        id: 'announcements',
        label: t('hackathons.detail.tabs.announcements'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'about',
          section: 'announcements',
        }),
      })
    }
    if (showAboutResultsNav) {
      items.push({
        id: 'results',
        label: t('hackathons.detail.tabs.results'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'about',
          section: 'results',
        }),
      })
    }
    return items
  }, [hackathonId, canSeeTask, canSeeAnnouncements, showAboutResultsNav, t])

  const managementNavItems = useMemo(() => {
    const items: { id: HackathonDetailQueryState['org']; label: string; href: string }[] = [
      {
        id: 'overview',
        label: t('hackathons.detail.management.org.overview'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'management',
          org: 'overview',
        }),
      },
      {
        id: 'participants',
        label: t('hackathons.management.teams.tabs.participants'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'management',
          org: 'participants',
        }),
      },
    ]
    if (showManagementLeaderboardNav) {
      items.push({
        id: 'leaderboard',
        label: t('hackathons.detail.management.org.leaderboard'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'management',
          org: 'leaderboard',
        }),
      })
    }
    if (showManagementResultsNav) {
      items.push({
        id: 'results',
        label: t('hackathons.detail.management.org.results'),
        href: routes.hackathons.hackathonDetailPath(hackathonId, {
          tab: 'management',
          org: 'results',
        }),
      })
    }
    return items
  }, [hackathonId, showManagementLeaderboardNav, showManagementResultsNav, t])

  if (isLoading && !initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="typography-body-md text-text-secondary">
          {t('hackathons.list.loading')}
        </span>
      </div>
    )
  }

  if (error) {
    const isAccessDenied =
      error instanceof Error &&
      'data' in error &&
      typeof (error as any).data === 'object' &&
      ((error as any).data.status === 401 || (error as any).data.status === 403)

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="typography-body-md text-state-error">
          {isAccessDenied
            ? t('hackathons.detail.errors.access_denied')
            : t('hackathons.list.error')}
        </span>
      </div>
    )
  }

  if (!hackathon) {
    return null
  }

  const breadcrumbItems = [
    {
      label: t('hackathons.breadcrumb.hackathons'),
      href: routes.hackathons.list,
    },
    {
      label: hackathon.name ?? t('common.fallback.hackathon'),
    },
  ]

  const showAboutRail = activeTopTab === 'about' && aboutNavItems.length > 1
  const showManagementRail =
    activeTopTab === 'management' && canManage && managementNavItems.length > 1

  const gutterX = 'px-m16 xl:px-m8'
  const detailWell = 'mx-auto w-full min-w-0 max-w-[1280px]'

  return (
    <div className="flex w-full min-w-0 flex-col gap-m10 py-m32">
      <div className={cn('w-full', gutterX)}>
        <div className={detailWell}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className={cn('w-full', gutterX)}>
        <div className={detailWell}>
          <Tabs
            tabs={tabs}
            activeTab={activeTopTab}
            onChange={() => {
              /* навигация только через href у табов */
            }}
          />
        </div>
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTopTab}`}
        aria-labelledby={`tab-${activeTopTab}`}
        className={cn(
          'w-full min-w-0 animate-in fade-in duration-200',
          activeTopTab === 'support' && 'flex min-h-[calc(100dvh-20rem)] flex-col'
        )}
      >
        {activeTopTab === 'about' && (
          <>
            {showAboutRail ? (
              <div className={cn('w-full', gutterX)}>
                <div className={detailWell}>
                  <div
                    className={cn(
                      'grid w-full min-w-0 grid-cols-1 gap-y-m6',
                      'lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-x-m8 lg:gap-y-0'
                    )}
                  >
                    <HackathonDetailSubnav
                      ariaLabel={t('hackathons.detail.about.navAria')}
                      items={aboutNavItems}
                      activeId={displayState.section}
                    />
                    <div className="min-w-0 space-y-m16">
                      {displayState.section === 'description' && (
                        <HackathonDetailInfo hackathonId={hackathonId} hackathon={hackathon} />
                      )}
                      {displayState.section === 'task' && canSeeTask && (
                        <TaskTabContent
                          hackathonId={hackathonId}
                          task={task ?? undefined}
                          isLoading={isLoadingTask}
                        />
                      )}
                      {displayState.section === 'announcements' && canSeeAnnouncements && (
                        <>
                          {isLoadingAnnouncements ? (
                            <div className="py-m8">
                              <p className="typography-body-md text-text-secondary">
                                {t('hackathons.list.loading')}
                              </p>
                            </div>
                          ) : (
                            <AnnouncementsList
                              announcements={announcements}
                              hackathonId={hackathonId}
                            />
                          )}
                        </>
                      )}
                      {displayState.section === 'results' && canAccessAboutResultsSection && (
                        <PublicResultSection hackathonId={hackathonId} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn('w-full', gutterX)}>
                <div className={cn(detailWell, 'space-y-m16')}>
                  {displayState.section === 'description' && (
                    <HackathonDetailInfo hackathonId={hackathonId} hackathon={hackathon} />
                  )}
                  {displayState.section === 'task' && canSeeTask && (
                    <TaskTabContent
                      hackathonId={hackathonId}
                      task={task ?? undefined}
                      isLoading={isLoadingTask}
                    />
                  )}
                  {displayState.section === 'announcements' && canSeeAnnouncements && (
                    <>
                      {isLoadingAnnouncements ? (
                        <div className="py-m8">
                          <p className="typography-body-md text-text-secondary">
                            {t('hackathons.list.loading')}
                          </p>
                        </div>
                      ) : (
                        <AnnouncementsList
                          announcements={announcements}
                          hackathonId={hackathonId}
                        />
                      )}
                    </>
                  )}
                  {displayState.section === 'results' && canAccessAboutResultsSection && (
                    <PublicResultSection hackathonId={hackathonId} />
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {activeTopTab === 'participation' && isParticipant && (
          <div className={cn('w-full', gutterX)}>
            <div className={detailWell}>
              <MyParticipationTabContent
                hackathonId={hackathonId}
                myTeamId={myTeamId}
                ctxLoading={myParticipationQuery.isLoading}
                hackathonStage={hackathon.stage}
                registrationPolicy={hackathon.registrationPolicy}
                resultPublished={resultPublished}
              />
            </div>
          </div>
        )}
        {activeTopTab === 'management' && canManage && (
          <>
            {showManagementRail ? (
              <div className={cn('w-full', gutterX)}>
                <div className={detailWell}>
                  <div
                    className={cn(
                      'grid w-full min-w-0 grid-cols-1 gap-y-m6',
                      'lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-x-m8 lg:gap-y-0'
                    )}
                  >
                    <HackathonDetailSubnav
                      ariaLabel={t('hackathons.detail.management.navAria')}
                      items={managementNavItems}
                      activeId={displayState.org}
                    />
                    <div className="min-w-0 space-y-m16">
                      {displayState.org === 'overview' && (
                        <HackathonManagementDashboard hackathon={hackathon} />
                      )}
                      {displayState.org === 'participants' && (
                        <OrganizerParticipantsTabContent hackathon={hackathon} />
                      )}
                      {displayState.org === 'leaderboard' && showManagementLeaderboardNav && (
                        <OrganizerJudgingStatusSection hackathonId={hackathonId} />
                      )}
                      {displayState.org === 'results' && showManagementResultsNav && (
                        <OrganizerResultSection
                          hackathonId={hackathonId}
                          resultPublished={resultPublished}
                          canUpdateResultDraft={canUpdateResultDraftDecision.allowed}
                          canPublishResult={canPublishResultDecision.allowed}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn('w-full', gutterX)}>
                <div className={cn(detailWell, 'space-y-m16')}>
                  {displayState.org === 'overview' && (
                    <HackathonManagementDashboard hackathon={hackathon} />
                  )}
                  {displayState.org === 'participants' && (
                    <OrganizerParticipantsTabContent hackathon={hackathon} />
                  )}
                  {displayState.org === 'leaderboard' && showManagementLeaderboardNav && (
                    <OrganizerJudgingStatusSection hackathonId={hackathonId} />
                  )}
                  {displayState.org === 'results' && showManagementResultsNav && (
                    <OrganizerResultSection
                      hackathonId={hackathonId}
                      resultPublished={resultPublished}
                      canUpdateResultDraft={canUpdateResultDraftDecision.allowed}
                      canPublishResult={canPublishResultDecision.allowed}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {activeTopTab === 'support' && showSupportTab && (
          <div className={cn('w-full min-h-0 flex-1 flex flex-col', gutterX)}>
            <div className={cn(detailWell, 'min-h-0 flex flex-1 flex-col')}>
              <SupportTabContent
                hackathonId={hackathonId}
                showStaffDashboard={canManage || hasMentorAccess === true}
                canManage={canManage}
              />
            </div>
          </div>
        )}
        {activeTopTab === 'judging' && showJudgingTab && (
          <div className={cn('w-full', gutterX)}>
            <div className={detailWell}>
              <JudgingTabContent
                hackathonId={hackathonId}
                stage={hackathon.stage}
                submissionsClosesAt={hackathon.dates?.submissionsClosesAt ?? null}
                showJudgeAssignments={canJudgeOrAssigned}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
