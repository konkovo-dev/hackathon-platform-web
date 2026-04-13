'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { useHackathonsByRoleQuery } from '@/entities/hackathon/model/useHackathonsByRoleQuery'
import { cn } from '@/shared/lib/cn'

export interface HackathonDetailProps {
  hackathonId: string
  initialData?: Hackathon
  initialTab?: string
}

type HackathonTab =
  | 'description'
  | 'task'
  | 'participation'
  | 'announcements'
  | 'management'
  | 'support'
  | 'judging'
  | 'participants'

export function HackathonDetail({ hackathonId, initialData, initialTab }: HackathonDetailProps) {
  const t = useT()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<HackathonTab>('description')
  const { data: hackathon, isLoading, error } = useHackathonDetailQuery(hackathonId, initialData)

  const { decision: canViewAnnouncementsDecision } = useCan('Hackathon.ViewAnnouncements', {
    hackathonId,
  })
  const canSeeAnnouncements = canViewAnnouncementsDecision.allowed

  const { decision: canReadTaskDecision } = useCan('Hackathon.ReadTask', { hackathonId })
  const canSeeTask = canReadTaskDecision.allowed

  const { decision: canManageDecision } = useCan('Hackathon.Manage', {
    hackathonId,
  })
  const canManage = canManageDecision.allowed

  const { decision: canJudgeDecision } = useCan('Judging.ViewMyJudgingAssignments', {
    hackathonId,
  })
  const canJudge = canJudgeDecision.allowed

  const { decision: canViewLeaderboardDecision, isLoading: canViewLeaderboardLoading } = useCan(
    'Judging.ViewLeaderboard',
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
  const showOrganizerJudgingTab =
    canManage &&
    !canViewLeaderboardLoading &&
    true // canViewLeaderboardDecision.allowed

  const showJudgingTab = canJudge || isJudgeByRoleList || showOrganizerJudgingTab

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

  const tabs: Tab<HackathonTab>[] = useMemo(() => {
    const baseTabs: Tab<HackathonTab>[] = [
      {
        id: 'description',
        label: t('hackathons.detail.tabs.description'),
        href: routes.hackathons.detailWithTab(hackathonId, 'description'),
      },
    ]
    if (canSeeTask) {
      baseTabs.push({
        id: 'task',
        label: t('hackathons.detail.tabs.task'),
        href: routes.hackathons.detailWithTab(hackathonId, 'task'),
      })
    }
    if (canSeeAnnouncements) {
      baseTabs.push({
        id: 'announcements',
        label: t('hackathons.detail.tabs.announcements'),
        href: routes.hackathons.detailWithTab(hackathonId, 'announcements'),
      })
    }
    if (isParticipant) {
      baseTabs.push({
        id: 'participation',
        label: t('hackathons.detail.tabs.participation'),
        href: routes.hackathons.detailWithTab(hackathonId, 'participation'),
      })
    }
    if (canManage) {
      baseTabs.push({
        id: 'management',
        label: t('hackathons.detail.tabs.management'),
        href: routes.hackathons.detailWithTab(hackathonId, 'management'),
      })
      baseTabs.push({
        id: 'participants',
        label: t('hackathons.management.teams.title'),
        href: routes.hackathons.detailWithTab(hackathonId, 'participants'),
      })
    }
    if (showSupportTab) {
      baseTabs.push({
        id: 'support',
        label: t('hackathons.detail.tabs.support'),
        href: routes.hackathons.detailWithTab(hackathonId, 'support'),
      })
    }
    if (showJudgingTab) {
      baseTabs.push({
        id: 'judging',
        label: t('hackathons.detail.tabs.judging'),
        href: routes.hackathons.detailWithTab(hackathonId, 'judging'),
      })
    }
    return baseTabs
  }, [
    hackathonId,
    isParticipant,
    canSeeAnnouncements,
    canSeeTask,
    canManage,
    showSupportTab,
    showJudgingTab,
    t,
  ])

  const tabIds = useMemo(() => tabs.map(tab => tab.id), [tabs])
  const activeTabSafe =
    activeTab && tabIds.includes(activeTab) ? activeTab : ('description' as HackathonTab)
  const setActiveTabSafe = (id: HackathonTab) => {
    setActiveTab(id)
    router.replace(
      routes.hackathons.detailWithTab(hackathonId, id === 'description' ? undefined : id)
    )
  }

  useEffect(() => {
    if (initialTab == null || initialTab === '') {
      setActiveTab('description')
    } else if (tabIds.includes(initialTab as HackathonTab)) {
      setActiveTab(initialTab as HackathonTab)
    }
  }, [initialTab, tabIds])

  useEffect(() => {
    if (activeTab && !tabIds.includes(activeTab)) {
      setActiveTab('description')
      router.replace(routes.hackathons.detailWithTab(hackathonId))
    }
  }, [activeTab, tabIds, hackathonId, router])

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

  return (
    <div className="flex flex-col gap-m16">
      <Breadcrumb items={breadcrumbItems} />

      <Tabs tabs={tabs} activeTab={activeTabSafe} onChange={setActiveTabSafe} />

      <div
        role="tabpanel"
        id={`tabpanel-${activeTabSafe}`}
        aria-labelledby={`tab-${activeTabSafe}`}
        className={cn(
          'animate-in fade-in duration-200',
          activeTabSafe === 'support' && 'flex min-h-[calc(100dvh-20rem)] flex-col'
        )}
      >
        {activeTabSafe === 'description' && (
          <div className="flex flex-col gap-m16">
            <HackathonDetailInfo hackathonId={hackathonId} hackathon={hackathon} />
          </div>
        )}
        {activeTabSafe === 'task' && canSeeTask && (
          <TaskTabContent
            hackathonId={hackathonId}
            task={task ?? undefined}
            isLoading={isLoadingTask}
          />
        )}
        {activeTabSafe === 'announcements' && canSeeAnnouncements && (
          <>
            {isLoadingAnnouncements ? (
              <div className="py-m8">
                <p className="typography-body-md text-text-secondary">
                  {t('hackathons.list.loading')}
                </p>
              </div>
            ) : (
              <AnnouncementsList announcements={announcements} hackathonId={hackathonId} />
            )}
          </>
        )}
        {activeTabSafe === 'participation' && isParticipant && (
          <MyParticipationTabContent
            hackathonId={hackathonId}
            myTeamId={myTeamId}
            ctxLoading={myParticipationQuery.isLoading}
            hackathonStage={hackathon.stage}
            registrationPolicy={hackathon.registrationPolicy}
          />
        )}
        {activeTabSafe === 'management' && canManage && (
          <HackathonManagementDashboard hackathon={hackathon} />
        )}
        {activeTabSafe === 'participants' && canManage && (
          <OrganizerParticipantsTabContent hackathon={hackathon} />
        )}
        {activeTabSafe === 'support' && showSupportTab && (
          <SupportTabContent
            hackathonId={hackathonId}
            showStaffDashboard={canManage || hasMentorAccess === true}
            canManage={canManage}
          />
        )}
        {activeTabSafe === 'judging' && showJudgingTab && (
          <JudgingTabContent
            hackathonId={hackathonId}
            stage={hackathon.stage}
            submissionsClosesAt={hackathon.dates?.submissionsClosesAt ?? null}
            showOrganizerLeaderboard={showOrganizerJudgingTab}
            showJudgeAssignments={canJudge || isJudgeByRoleList}
          />
        )}
      </div>
    </div>
  )
}
