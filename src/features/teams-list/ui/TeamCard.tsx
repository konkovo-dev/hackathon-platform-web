'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button, Icon, IconText } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { listTeamMembers, type TeamWithVacancies } from '@/entities/team'
import { cn } from '@/shared/lib/cn'

export interface TeamCardProps {
  hackathonId: string
  teamWithVacancies: TeamWithVacancies
  hackathonName?: string
  className?: string
  variant?: 'elevated' | 'bordered'
}

export function TeamCard({
  hackathonId,
  teamWithVacancies,
  hackathonName,
  className,
  variant = 'elevated',
}: TeamCardProps) {
  const t = useT()
  const router = useRouter()

  const { team, vacancies } = teamWithVacancies
  const teamId = team?.teamId ?? ''
  const { data: membersData } = useQuery({
    queryKey: ['team-members', hackathonId, teamId],
    queryFn: () => listTeamMembers(hackathonId, teamId),
    enabled: !!team && !!hackathonId && !!teamId,
  })

  if (!team) return null

  const memberCount = membersData?.members?.length ?? 0
  const openVacancies =
    vacancies?.reduce((sum, v) => sum + parseInt(v.slotsOpen ?? '0', 10), 0) ?? 0
  const totalVacancies =
    vacancies?.reduce((sum, v) => sum + parseInt(v.slotsTotal ?? '0', 10), 0) ?? 0

  const membersLabel =
    memberCount === 1
      ? t('teams.card.member', { count: 1 })
      : t('teams.card.members', { count: memberCount })

  const handleNavigate = () => {
    if (team.teamId) {
      router.push(routes.hackathons.teams.detail(hackathonId, team.teamId))
    }
  }

  const isElevated = variant === 'elevated'
  const isBordered = variant === 'bordered'

  return (
    <div
      className={cn(
        'flex flex-col p-m8 w-[258px] h-full',
        'rounded-[var(--spacing-m4)] overflow-hidden',
        'animate-in fade-in zoom-in-95 duration-150',
        'transition-all duration-200 ease-out',
        'cursor-pointer',
        isElevated && [
          'bg-bg-elevated hover:bg-bg-hover',
          'hover:scale-[1.02] hover:-translate-y-1',
          'hover:shadow-[0_8px_24px_-4px_var(--color-shadow-color)]',
        ],
        isBordered && ['border border-border-default hover:border-border-strong'],
        className
      )}
      onClick={handleNavigate}
    >
      <div className="flex flex-col gap-m8 flex-1">
        <h3 className="typography-title-md text-text-primary">{team.name}</h3>
        <div className="flex flex-col gap-m4">
          {hackathonName && (
            <IconText
              icon={<Icon src="/icons/icon-code/icon-code-md.svg" size="md" />}
              text={hackathonName}
            />
          )}
          <IconText
            icon={<Icon src="/icons/icon-team/iton-team-md.svg" size="md" />}
            text={membersLabel}
          />
          {totalVacancies > 0 && (
            <IconText
              icon={<Icon src="/icons/icon-briefcase/icon-briefcase-md.svg" size="md" />}
              text={t('teams.vacancies.slots', {
                open: openVacancies,
                total: totalVacancies,
              })}
            />
          )}

          {team.isJoinable ? (
            <IconText
              icon={<Icon src="/icons/icon-lock/icon-lock-opened-md.svg" size="md" />}
              text={t('teams.card.openForRequests')}
            />
          ) : (
            <IconText
              icon={<Icon src="/icons/icon-lock/icon-closed-opened-md.svg" size="md" />}
              text={t('teams.card.closedForRequests')}
            />
          )}
        </div>
      </div>

      <Button
        variant="action"
        size="lg"
        className="w-full mt-m8"
        onClick={e => {
          e.stopPropagation()
          handleNavigate()
        }}
      >
        {t('hackathons.card.details')}
      </Button>
    </div>
  )
}
