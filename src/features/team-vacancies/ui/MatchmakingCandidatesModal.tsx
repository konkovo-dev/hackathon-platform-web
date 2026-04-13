'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Chip, ChipList, ErrorAlert } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useMatchmakingCandidatesQuery } from '@/entities/team/model/hooks'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import { UserListItem } from '@/entities/user'
import { useCreateTeamInvitationMutation } from '@/features/team-members/model/hooks'
import type { components } from '@/shared/api/platform.schema'
import { ApiError } from '@/shared/api/errors'

type CandidateRecommendation = components['schemas']['v1CandidateRecommendation']

export interface MatchmakingCandidatesModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  teamId: string
  vacancyId: string
}

function skillLabel(s: components['schemas']['v1Skill']) {
  return s.catalog?.name?.trim() || s.custom?.name?.trim() || ''
}

export function MatchmakingCandidatesModal({
  open,
  onClose,
  hackathonId,
  teamId,
  vacancyId,
}: MatchmakingCandidatesModalProps) {
  const t = useT()
  const router = useRouter()
  const [invitedUserIds, setInvitedUserIds] = useState<Set<string>>(() => new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setInvitedUserIds(new Set())
      setError(null)
    }
  }, [open])

  const {
    data,
    isLoading,
    error: loadError,
  } = useMatchmakingCandidatesQuery(
    open ? hackathonId : null,
    open ? teamId : null,
    open ? vacancyId : null
  )

  const userIds = useMemo(() => {
    const recs = data?.recommendations ?? []
    return recs.map(r => r.userId).filter((id): id is string => id != null && id.length > 0)
  }, [data?.recommendations])

  const { data: usersBatch } = useQuery({
    queryKey: ['users-batch', userIds, 'skills'],
    queryFn: () => batchGetUsers({ userIds, includeSkills: true }),
    enabled: open && userIds.length > 0,
  })

  const usersById = useMemo(() => {
    const map = new Map<string, components['schemas']['v1GetUserResponse']>()
    for (const entry of usersBatch?.users ?? []) {
      if (entry.user?.userId) {
        map.set(entry.user.userId, entry)
      }
    }
    return map
  }, [usersBatch?.users])

  const inviteMutation = useCreateTeamInvitationMutation(hackathonId, teamId)

  const handleInvite = async (userId: string) => {
    try {
      setError(null)
      await inviteMutation.mutateAsync({
        targetUserId: userId,
        vacancyId,
      })
      setInvitedUserIds(prev => new Set(prev).add(userId))
    } catch (err) {
      console.error('Invite failed:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.inviteFailed'))
      } else {
        setError(t('teams.errors.inviteFailed'))
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('teams.matchmaking.modalTitle')} size="lg">
      <div className="flex flex-col gap-m6">
        {loadError && (
          <p className="typography-body-sm text-state-error">{t('teams.matchmaking.loadError')}</p>
        )}
        {error && <ErrorAlert message={error} />}

        {isLoading && (
          <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
        )}

        {!isLoading && !loadError && (data?.recommendations ?? []).length === 0 && (
          <p className="typography-body-sm text-text-secondary">{t('teams.matchmaking.empty')}</p>
        )}

        {!isLoading &&
          (data?.recommendations ?? []).map((rec: CandidateRecommendation) => {
            const userId = rec.userId
            if (!userId) return null
            const row = usersById.get(userId)
            const u = row?.user
            const skills = (row?.skills ?? []).map(skillLabel).filter(Boolean)
            const score = rec.matchScore?.totalScore
            const scoreText =
              score != null ? t('teams.matchmaking.matchScore', { score: score.toFixed(1) }) : null
            const invited = invitedUserIds.has(userId)

            const chipsLinkClass =
              'block rounded-[var(--spacing-m2)] -m-m2 p-m2 transition-colors hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong'

            return (
              <div key={userId} className="flex flex-col gap-m4">
                <UserListItem
                  userId={userId}
                  user={u}
                  caption={scoreText ?? undefined}
                  variant="bordered"
                  showNavigationIcon={false}
                  onClick={() => {
                    onClose()
                    router.push(routes.user(userId))
                  }}
                  rightContent={
                    invited ? (
                      <span className="typography-body-sm-regular text-text-tertiary">
                        {t('teams.matchmaking.invited')}
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          void handleInvite(userId)
                        }}
                        disabled={inviteMutation.isPending}
                      >
                        {t('teams.matchmaking.invite')}
                      </Button>
                    )
                  }
                />
                {skills.length > 0 && (
                  <Link
                    href={routes.user(userId)}
                    onClick={() => onClose()}
                    className={chipsLinkClass}
                  >
                    <ChipList>
                      {skills.map(s => (
                        <Chip key={s} label={s} variant="secondary" />
                      ))}
                    </ChipList>
                  </Link>
                )}
              </div>
            )
          })}
      </div>
    </Modal>
  )
}
