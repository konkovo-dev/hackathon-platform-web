'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Input, Tabs } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { HackathonListItem } from '@/entities/hackathon'
import { UserListItem } from '@/entities/user/ui/UserListItem'
import { useHackathonSearch } from '../model/useHackathonSearch'
import { useUserSearch } from '../model/useUserSearch'

export interface SearchModalProps {
  open: boolean
  onClose: () => void
  isAuthed: boolean
}

type SearchTab = 'hackathons' | 'users'

export function SearchModal({ open, onClose, isAuthed }: SearchModalProps) {
  const t = useT()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('hackathons')

  const hackathonSearch = useHackathonSearch(searchQuery)
  const userSearch = useUserSearch(searchQuery, isAuthed)

  const tabs = [
    { id: 'hackathons' as const, label: t('search.tabs.hackathons') },
    ...(isAuthed ? [{ id: 'users' as const, label: t('search.tabs.users') }] : []),
  ]

  const handleClear = () => {
    setSearchQuery('')
  }

  const handleHackathonClick = (hackathonId: string) => {
    router.push(routes.hackathons.detail(hackathonId))
    onClose()
  }

  const handleUserClick = (userId: string) => {
    router.push(routes.user(userId))
    onClose()
  }

  const renderEmptyState = () => {
    if (searchQuery.length === 0) {
      return (
        <div className="flex items-center justify-center py-m16 text-text-tertiary typography-caption-sm-regular">
          {t('search.states.empty_query')}
        </div>
      )
    }

    if (searchQuery.length < 2) {
      return (
        <div className="flex items-center justify-center py-m16 text-text-tertiary typography-caption-sm-regular">
          {t('search.states.min_chars')}
        </div>
      )
    }

    return null
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-m16 text-text-tertiary typography-caption-sm-regular">
      {t('search.states.loading')}
    </div>
  )

  const renderNoResults = () => (
    <div className="flex items-center justify-center py-m16 text-text-tertiary typography-caption-sm-regular">
      {t('search.states.no_results')}
    </div>
  )

  const renderErrorState = () => (
    <div className="flex items-center justify-center py-m16 text-state-error typography-caption-sm-regular">
      {t('search.states.error')}
    </div>
  )

  const renderHackathonsTab = () => {
    const emptyState = renderEmptyState()
    if (emptyState) return emptyState

    if (hackathonSearch.isLoading) return renderLoadingState()
    if (hackathonSearch.isError) return renderErrorState()

    const hackathons = hackathonSearch.data?.hackathons ?? []

    if (hackathons.length === 0) return renderNoResults()

    return (
      <div className="flex flex-col gap-m2">
        {hackathons.map(hackathon => (
          <HackathonListItem
            key={hackathon.hackathonId}
            hackathon={hackathon as any}
            hackathonId={hackathon.hackathonId}
            variant="bordered"
            onClick={() => handleHackathonClick(hackathon.hackathonId!)}
            showStatus={true}
          />
        ))}
      </div>
    )
  }

  const renderUsersTab = () => {
    const emptyState = renderEmptyState()
    if (emptyState) return emptyState

    if (userSearch.isLoading) return renderLoadingState()
    if (userSearch.isError) return renderErrorState()

    const users = userSearch.data?.users ?? []

    if (users.length === 0) return renderNoResults()

    return (
      <div className="flex flex-col gap-m2">
        {users.map(userResponse => (
          <UserListItem
            key={userResponse.user?.userId}
            userId={userResponse.user?.userId}
            user={userResponse.user}
            variant="bordered"
            onClick={() => userResponse.user?.userId && handleUserClick(userResponse.user.userId)}
            showNavigationIcon={true}
          />
        ))}
      </div>
    )
  }

  return (
    <Modal open={open} onClose={onClose} title={t('search.title')} size="lg">
      <div className="flex flex-col gap-m6">
        <Input
          variant="search"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onClear={handleClear}
        />

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="h-[400px] overflow-y-auto">
          {activeTab === 'hackathons' && renderHackathonsTab()}
          {activeTab === 'users' && renderUsersTab()}
        </div>
      </div>
    </Modal>
  )
}
