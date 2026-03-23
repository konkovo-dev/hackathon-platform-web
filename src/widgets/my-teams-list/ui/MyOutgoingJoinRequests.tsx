'use client'

import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ListItem, Section } from '@/shared/ui'
import { useT, useI18n } from '@/shared/i18n/useT'
import { formatDateTime } from '@/shared/lib/formatDate'
import { routes } from '@/shared/config/routes'
import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'
import { getTeam, type JoinRequest } from '@/entities/team'
import { useMyJoinRequestsQuery } from '../model/hooks'
import { useSessionQuery } from '@/features/auth/model/hooks'

function statusToI18nKey(
  status: JoinRequest['status']
):
  | 'teams.my.outgoingJoinRequests.status.unspecified'
  | 'teams.my.outgoingJoinRequests.status.pending'
  | 'teams.my.outgoingJoinRequests.status.accepted'
  | 'teams.my.outgoingJoinRequests.status.declined'
  | 'teams.my.outgoingJoinRequests.status.canceled'
  | 'teams.my.outgoingJoinRequests.status.expired' {
  switch (status) {
    case 'TEAM_INBOX_PENDING':
      return 'teams.my.outgoingJoinRequests.status.pending'
    case 'TEAM_INBOX_ACCEPTED':
      return 'teams.my.outgoingJoinRequests.status.accepted'
    case 'TEAM_INBOX_DECLINED':
      return 'teams.my.outgoingJoinRequests.status.declined'
    case 'TEAM_INBOX_CANCELED':
      return 'teams.my.outgoingJoinRequests.status.canceled'
    case 'TEAM_INBOX_EXPIRED':
      return 'teams.my.outgoingJoinRequests.status.expired'
    default:
      return 'teams.my.outgoingJoinRequests.status.unspecified'
  }
}

export function MyOutgoingJoinRequests() {
  const t = useT()
  const { locale } = useI18n()
  const router = useRouter()
  const sessionQuery = useSessionQuery()
  const isAuthed = sessionQuery.data?.active === true

  const { data, isLoading, isError } = useMyJoinRequestsQuery()

  const requests = useMemo(() => {
    const list = data?.requests ?? []
    return [...list].sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0
      return tb - ta
    })
  }, [data?.requests])

  const uniqueHackathonIds = useMemo(() => {
    const s = new Set<string>()
    for (const r of requests) {
      if (r.hackathonId) s.add(r.hackathonId)
    }
    return [...s]
  }, [requests])

  const uniqueTeamPairs = useMemo(() => {
    const seen = new Set<string>()
    const out: { hackathonId: string; teamId: string }[] = []
    for (const r of requests) {
      const h = r.hackathonId
      const tid = r.teamId
      if (!h || !tid) continue
      const key = `${h}:${tid}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ hackathonId: h, teamId: tid })
    }
    return out
  }, [requests])

  const hackathonQueries = useQueries({
    queries: uniqueHackathonIds.map(hackathonId => ({
      queryKey: ['hackathon', hackathonId],
      queryFn: async () => {
        const response = await platformFetchJson<
          operations['HackathonService_GetHackathon']['responses']['200']['content']['application/json']
        >(`/v1/hackathons/${hackathonId}`, { method: 'GET' })
        return response.hackathon
      },
      enabled: isAuthed && Boolean(hackathonId),
    })),
  })

  const teamQueries = useQueries({
    queries: uniqueTeamPairs.map(({ hackathonId, teamId }) => ({
      queryKey: ['team', hackathonId, teamId],
      queryFn: () => getTeam(hackathonId, teamId, { includeVacancies: true }),
      enabled: isAuthed && Boolean(hackathonId && teamId),
    })),
  })

  const hackathonNameById = useMemo(() => {
    const m = new Map<string, string>()
    uniqueHackathonIds.forEach((id, i) => {
      const name = hackathonQueries[i]?.data?.name
      if (id && name) m.set(id, name)
    })
    return m
  }, [uniqueHackathonIds, hackathonQueries])

  const teamNameByPair = useMemo(() => {
    const m = new Map<string, string>()
    uniqueTeamPairs.forEach((p, i) => {
      const name = teamQueries[i]?.data?.team?.team?.name
      const key = `${p.hackathonId}:${p.teamId}`
      if (name) m.set(key, name)
    })
    return m
  }, [uniqueTeamPairs, teamQueries])

  if (!isAuthed) {
    return null
  }

  return (
    <Section title={t('teams.my.outgoingJoinRequests.title')} variant="elevated">
      {isLoading && (
        <p className="typography-body-sm text-text-secondary">
          {t('teams.my.outgoingJoinRequests.loading')}
        </p>
      )}
      {isError && !isLoading && (
        <p className="typography-body-sm text-state-error">
          {t('teams.my.outgoingJoinRequests.loadError')}
        </p>
      )}
      {!isLoading && !isError && requests.length === 0 && (
        <p className="typography-body-sm text-text-secondary">
          {t('teams.my.outgoingJoinRequests.empty')}
        </p>
      )}
      {!isLoading && !isError && requests.length > 0 && (
        <div className="flex flex-col gap-m4">
          {requests.map(req => {
            const hackathonId = req.hackathonId
            const teamId = req.teamId
            const pairKey =
              hackathonId && teamId ? `${hackathonId}:${teamId}` : ''
            const teamName =
              (pairKey && teamNameByPair.get(pairKey)) ||
              t('teams.my.outgoingJoinRequests.teamUnknown')
            const hackathonName =
              (hackathonId && hackathonNameById.get(hackathonId)) ||
              t('common.fallback.hackathon')
            const statusLabel = t(statusToI18nKey(req.status))
            const sent =
              req.createdAt != null
                ? formatDateTime(req.createdAt, locale === 'en' ? 'en' : 'ru')
                : null
            const subtitle = [
              hackathonName,
              statusLabel,
              sent ? t('teams.my.outgoingJoinRequests.sentAt', { date: sent }) : null,
            ]
              .filter(Boolean)
              .join(' · ')

            const canNavigate = Boolean(hackathonId && teamId)

            return (
              <ListItem
                key={req.requestId ?? `${pairKey}-${req.createdAt}`}
                variant="bordered"
                text={teamName}
                subtitle={subtitle}
                onClick={
                  canNavigate
                    ? () =>
                        router.push(
                          routes.hackathons.teams.detail(hackathonId!, teamId!)
                        )
                    : undefined
                }
              />
            )
          })}
        </div>
      )}
    </Section>
  )
}
