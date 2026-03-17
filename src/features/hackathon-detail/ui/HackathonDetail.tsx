'use client'

import { useState, useMemo, useEffect } from 'react'
import { Breadcrumb, Tabs, type Tab } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { useCan } from '@/shared/policy/useCan'
import { useHackathonDetailQuery, useHackathonAnnouncementsQuery, useHackathonTaskQuery } from '../model/hooks'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { HackathonDetailInfo } from './HackathonDetailInfo'
import { MyTeamTabContent } from './MyTeamTabContent'
import { TaskTabContent } from './TaskTabContent'
import { AnnouncementsList } from './AnnouncementsList'
import { HackathonManagementDashboard } from '@/widgets/hackathon-management-dashboard/ui/HackathonManagementDashboard'

export interface HackathonDetailProps {
  hackathonId: string
  initialData?: Hackathon
}

type HackathonTab = 'description' | 'task' | 'myTeam' | 'announcements' | 'management'

export function HackathonDetail({ hackathonId, initialData }: HackathonDetailProps) {
  const t = useT()
  const [activeTab, setActiveTab] = useState<HackathonTab>('description')
  const { data: hackathon, isLoading, error } = useHackathonDetailQuery(hackathonId, initialData)
  
  const { decision: canViewAnnouncementsDecision } = useCan('Hackathon.ViewAnnouncements', {
    hackathonId
  })
  const canSeeAnnouncements = canViewAnnouncementsDecision.allowed

  const { decision: canReadTaskDecision } = useCan('Hackathon.ReadTask', { hackathonId })
  const canSeeTask = canReadTaskDecision.allowed

  const { decision: canManageDecision, isLoading: isLoadingCanManage } = useCan('Hackathon.Manage', {
    hackathonId
  })
  const canManage = canManageDecision.allowed

  const { decision: canCreateTeamDecision } = useCan('Team.Create', { hackathonId })
  const canCreateTeam = canCreateTeamDecision.allowed

  const myParticipationQuery = useMyParticipationQuery(hackathonId)
  const myTeamId = myParticipationQuery.data?.teamId ?? null

  const { data: announcements = [], isLoading: isLoadingAnnouncements } =
    useHackathonAnnouncementsQuery(canSeeAnnouncements ? hackathonId : null)

  const { data: task, isLoading: isLoadingTask } = useHackathonTaskQuery(
    canSeeTask ? hackathonId : null,
    canSeeTask
  )

  const tabs: Tab<HackathonTab>[] = useMemo(() => {
    const baseTabs: Tab<HackathonTab>[] = [
      { id: 'description', label: t('hackathons.detail.tabs.description') },
    ]
    if (canSeeTask) {
      baseTabs.push({ id: 'task', label: t('hackathons.detail.tabs.task') })
    }
    if (myTeamId != null) {
      baseTabs.push({ id: 'myTeam', label: t('hackathons.detail.tabs.myTeam') })
    }
    if (canSeeAnnouncements) {
      baseTabs.push({ id: 'announcements', label: t('hackathons.detail.tabs.announcements') })
    }
    if (canManage) {
      baseTabs.push({ id: 'management', label: t('hackathons.detail.tabs.management') })
    }
    return baseTabs
  }, [myTeamId, canSeeAnnouncements, canSeeTask, canManage, t])

  const tabIds = useMemo(() => tabs.map(tab => tab.id), [tabs])
  const activeTabSafe =
    activeTab && tabIds.includes(activeTab) ? activeTab : ('description' as HackathonTab)
  const setActiveTabSafe = (id: HackathonTab) => setActiveTab(id)

  useEffect(() => {
    if (activeTab && !tabIds.includes(activeTab)) {
      setActiveTab('description')
    }
  }, [activeTab, tabIds])

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
        className="animate-in fade-in duration-200"
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
        {activeTabSafe === 'myTeam' && myTeamId && (
          <MyTeamTabContent
            hackathonId={hackathonId}
            myTeamId={myTeamId}
            ctxLoading={myParticipationQuery.isLoading}
            canCreateTeam={canCreateTeam}
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
        {activeTabSafe === 'management' && canManage && (
          <HackathonManagementDashboard hackathon={hackathon} />
        )}
      </div>
    </div>
  )
}
