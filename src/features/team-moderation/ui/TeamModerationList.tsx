'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Section, SelectList, Chip, ChipList, Input, ListItem, Icon, Tabs } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import {
  useParticipationsQuery,
  useParticipationUsersQuery,
  useHackathonTeamsNameMapQuery,
} from '../model/hooks'
import { UserListItem } from '@/entities/user'
import { useTeamsQuery } from '@/features/teams-list'
import type { User } from '@/entities/user'
import type {
  HackathonParticipation,
  ParticipationStatus,
} from '@/entities/hackathon/api/listParticipations'
import { routes } from '@/shared/config/routes'

export interface TeamModerationListProps {
  hackathonId: string
}

const STATUS_OPTIONS: ParticipationStatus[] = [
  'PART_LOOKING_FOR_TEAM',
  'PART_INDIVIDUAL',
  'PART_TEAM_MEMBER',
  'PART_TEAM_CAPTAIN',
]

type ManagementTab = 'participants' | 'teams'

function matchesParticipantSearch(
  participation: HackathonParticipation,
  user: User | undefined,
  teamName: string | undefined,
  q: string
): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const parts: string[] = []
  if (user?.firstName) parts.push(user.firstName)
  if (user?.lastName) parts.push(user.lastName)
  if (user?.username) parts.push(user.username)
  if (participation.userId) parts.push(participation.userId)
  if (teamName) parts.push(teamName)
  return parts.some(p => p.toLowerCase().includes(needle))
}

export function TeamModerationList({ hackathonId }: TeamModerationListProps) {
  const t = useT()
  const router = useRouter()
  const [tab, setTab] = useState<ManagementTab>('participants')
  const [selectedStatuses, setSelectedStatuses] = useState<ParticipationStatus[]>([])
  const [participantSearch, setParticipantSearch] = useState('')
  const [teamsSearch, setTeamsSearch] = useState('')

  const { data, isLoading } = useParticipationsQuery(
    hackathonId,
    selectedStatuses.length > 0 ? selectedStatuses : undefined
  )

  const participations = useMemo(() => data?.participants || [], [data?.participants])
  const userIds = useMemo(
    () => participations.map(p => p.userId).filter((id): id is string => id != null),
    [participations]
  )
  const { data: usersData } = useParticipationUsersQuery(userIds)
  const { data: teamsNameMap } = useHackathonTeamsNameMapQuery(hackathonId)

  const { data: teamsData, isLoading: teamsLoading } = useTeamsQuery(
    hackathonId,
    teamsSearch.trim() || undefined
  )

  const usersMap = useMemo(() => {
    if (!usersData?.users) return new Map()
    return new Map(usersData.users.map(u => [u.userId, u]))
  }, [usersData])

  const toggleStatus = (status: ParticipationStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const getStatusLabel = (status: ParticipationStatus) => {
    switch (status) {
      case 'PART_LOOKING_FOR_TEAM':
        return t('hackathons.management.teams.status.lookingForTeam')
      case 'PART_INDIVIDUAL':
        return t('hackathons.management.teams.status.single')
      case 'PART_TEAM_MEMBER':
      case 'PART_TEAM_CAPTAIN':
        return t('hackathons.management.teams.status.team')
      default:
        return status
    }
  }

  const stats = useMemo(() => {
    const byStatus = participations.reduce(
      (acc, p) => {
        const status = p.status ?? 'PARTICIPATION_STATUS_UNSPECIFIED'
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return { byStatus }
  }, [participations])

  const filteredParticipations = useMemo(() => {
    return participations.filter(p => {
      const user = p.userId ? usersMap.get(p.userId) : undefined
      const teamId = p.teamId
      const teamName = teamId ? teamsNameMap?.get(teamId) : undefined
      return matchesParticipantSearch(p, user, teamName, participantSearch)
    })
  }, [participations, usersMap, teamsNameMap, participantSearch])

  const teamsList = teamsData?.teams ?? []

  const managementTabs = useMemo(
    () => [
      { id: 'participants' as const, label: t('hackathons.management.teams.tabs.participants') },
      { id: 'teams' as const, label: t('hackathons.management.teams.tabs.teams') },
    ],
    [t]
  )

  return (
    <Section title={t('hackathons.management.teams.title')}>
      <div className="flex flex-col gap-m6">
        <Tabs tabs={managementTabs} activeTab={tab} onChange={setTab} />

        {tab === 'participants' && (
          <div
            className="flex flex-col gap-m6"
            role="tabpanel"
            id="tabpanel-participants"
            aria-labelledby="tab-participants"
          >
            <div className="flex flex-col gap-m4">
              <Input
                variant="search"
                placeholder={t('hackathons.management.teams.searchParticipants')}
                value={participantSearch}
                onChange={e => setParticipantSearch(e.target.value)}
                onClear={() => setParticipantSearch('')}
              />
              <ChipList>
                {STATUS_OPTIONS.map(status => (
                  <Chip
                    key={status}
                    label={`${getStatusLabel(status)} (${stats.byStatus[status] || 0})`}
                    variant={selectedStatuses.includes(status) ? 'primary' : 'secondary'}
                    onClick={() => toggleStatus(status)}
                  />
                ))}
              </ChipList>
            </div>

            {isLoading ? (
              <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
            ) : participations.length > 0 ? (
              filteredParticipations.length > 0 ? (
                <SelectList>
                  {filteredParticipations.map(participation => {
                    const teamId = participation.teamId
                    const resolvedName = teamId ? teamsNameMap?.get(teamId) : undefined
                    const teamDisplay = teamId ? resolvedName ?? teamId : undefined
                    const captionParts = [
                      getStatusLabel(
                        participation.status ?? 'PARTICIPATION_STATUS_UNSPECIFIED'
                      ),
                    ]
                    if (teamDisplay) {
                      captionParts.push(teamDisplay)
                    }
                    return (
                      <UserListItem
                        key={participation.userId ?? 'unknown'}
                        userId={participation.userId}
                        user={usersMap.get(participation.userId ?? '')}
                        caption={captionParts.join(' • ')}
                        variant="bordered"
                        showNavigationIcon={true}
                      />
                    )
                  })}
                </SelectList>
              ) : (
                <p className="typography-body-sm text-text-secondary">
                  {t('hackathons.management.teams.searchEmpty')}
                </p>
              )
            ) : (
              <p className="typography-body-sm text-text-secondary">
                {t('hackathons.management.teams.empty')}
              </p>
            )}
          </div>
        )}

        {tab === 'teams' && (
          <div
            className="flex flex-col gap-m6"
            role="tabpanel"
            id="tabpanel-teams"
            aria-labelledby="tab-teams"
          >
            <Input
              variant="search"
              placeholder={t('hackathons.management.teams.searchTeams')}
              value={teamsSearch}
              onChange={e => setTeamsSearch(e.target.value)}
              onClear={() => setTeamsSearch('')}
            />

            {teamsLoading ? (
              <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
            ) : teamsList.length > 0 ? (
              <SelectList>
                {teamsList.map(tw => {
                  const team = tw.team
                  const id = team?.teamId
                  const name = team?.name
                  if (!id || !name) return null
                    return (
                    <ListItem
                      key={id}
                      text={name}
                      variant="bordered"
                      onClick={() =>
                        router.push(routes.hackathons.teams.detail(hackathonId, id))
                      }
                      rightContent={
                        <Icon
                          src="/icons/icon-arrow/icon-arrow-right-md.svg"
                          size="md"
                          color="secondary"
                        />
                      }
                    />
                  )
                })}
              </SelectList>
            ) : (
              <p className="typography-body-sm text-text-secondary">
                {teamsSearch.trim()
                  ? t('hackathons.management.teams.searchEmpty')
                  : t('teams.list.empty')}
              </p>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
