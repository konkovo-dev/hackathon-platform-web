'use client'

import { ListItem, Icon, Chip } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'
import type { Hackathon } from '../model/types'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'

export interface HackathonListItemProps {
  hackathon: Hackathon | undefined
  hackathonId: string | undefined
  variant?: 'default' | 'bordered' | 'section'
  onClick?: () => void
  showStatus?: boolean
}

function getStageLabel(stage: HackathonStage | undefined, t: ReturnType<typeof useT>): string | undefined {
  if (!stage) return undefined
  
  switch (stage) {
    case 'DRAFT':
      return t('search.hackathon_status.draft')
    case 'UPCOMING':
      return t('search.hackathon_status.upcoming')
    case 'REGISTRATION':
      return t('search.hackathon_status.registration')
    case 'PRESTART':
    case 'RUNNING':
    case 'JUDGING':
      return t('search.hackathon_status.running')
    case 'FINISHED':
      return t('search.hackathon_status.finished')
    default:
      return undefined
  }
}

export function HackathonListItem({
  hackathon,
  hackathonId,
  variant = 'bordered',
  onClick,
  showStatus = false,
}: HackathonListItemProps) {
  const t = useT()
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (hackathonId) {
      router.push(routes.hackathons.detail(hackathonId))
    }
  }

  const getSubtitle = () => {
    if (!hackathon) return undefined

    const parts: string[] = []

    // Формат и место
    if (hackathon.location?.online) {
      parts.push('online')
    } else if (hackathon.location?.city) {
      parts.push(hackathon.location.city)
    } else if (hackathon.location?.country) {
      parts.push(hackathon.location.country)
    }

    // Даты
    if (hackathon.dates?.startsAt && hackathon.dates?.endsAt) {
      const start = new Date(hackathon.dates.startsAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
      const end = new Date(hackathon.dates.endsAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
      parts.push(`${start} – ${end}`)
    }

    return parts.length > 0 ? parts.join(' • ') : undefined
  }

  const stageLabel = showStatus ? getStageLabel(hackathon?.stage, t) : undefined

  return (
    <ListItem
      text={hackathon?.name || t('common.fallback.hackathon')}
      subtitle={getSubtitle()}
      variant={variant}
      onClick={handleClick}
      rightContent={
        <div className="flex items-center gap-m4">
          {stageLabel && <Chip label={stageLabel} variant="primary" />}
          <Icon src="/icons/icon-arrow/icon-arrow-right-md.svg" size="md" color="secondary" />
        </div>
      }
    />
  )
}
