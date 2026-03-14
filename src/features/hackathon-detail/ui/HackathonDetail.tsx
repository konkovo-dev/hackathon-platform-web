'use client'

import { useState, useMemo } from 'react'
import { Breadcrumb, Tabs, type Tab } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { useCan } from '@/shared/policy/useCan'
import { useHackathonDetailQuery, useHackathonAnnouncementsQuery } from '../model/hooks'
import { HackathonDetailInfo } from './HackathonDetailInfo'
import { AnnouncementsList } from './AnnouncementsList'

export interface HackathonDetailProps {
  hackathonId: string
  initialData?: Hackathon
}

type HackathonTab = 'description' | 'announcements'

export function HackathonDetail({ hackathonId, initialData }: HackathonDetailProps) {
  const t = useT()
  const [activeTab, setActiveTab] = useState<HackathonTab>('description')
  const { data: hackathon, isLoading, error } = useHackathonDetailQuery(hackathonId, initialData)
  
  const { decision: canViewAnnouncementsDecision } = useCan('Hackathon.ViewAnnouncements', { 
    hackathonId 
  })
  const canSeeAnnouncements = canViewAnnouncementsDecision.allowed
  
  const { data: announcements = [], isLoading: isLoadingAnnouncements } =
    useHackathonAnnouncementsQuery(canSeeAnnouncements ? hackathonId : null)
  
  const tabs: Tab<HackathonTab>[] = useMemo(() => {
    const baseTabs: Tab<HackathonTab>[] = [
      { id: 'description', label: t('hackathons.detail.tabs.description') },
    ]
    
    if (canSeeAnnouncements) {
      baseTabs.push({ id: 'announcements', label: t('hackathons.detail.tabs.announcements') })
    }
    
    return baseTabs
  }, [canSeeAnnouncements, t])

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="typography-body-md text-state-error">
          {t('hackathons.list.error')}
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
      href: '/hackathons',
    },
    {
      label: hackathon.name,
    },
  ]

  return (
    <div className="flex flex-col gap-m16">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="animate-in fade-in duration-200"
      >
        {activeTab === 'description' && (
          <div className="flex flex-col gap-m16">
            {/* Main Info */}
            <HackathonDetailInfo hackathon={hackathon} />
          </div>
        )}
        {activeTab === 'announcements' && canSeeAnnouncements && (
          <>
            {isLoadingAnnouncements ? (
              <div className="py-m8">
                <p className="typography-body-md text-text-secondary">
                  {t('hackathons.list.loading')}
                </p>
              </div>
            ) : (
              <AnnouncementsList announcements={announcements} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
