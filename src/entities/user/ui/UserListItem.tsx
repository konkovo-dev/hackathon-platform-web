import { useState } from 'react'
import { ListItem, Icon, Chip } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useRouter } from 'next/navigation'
import { routes } from '@/shared/config/routes'
import { useSessionQuery } from '@/features/auth/model/hooks'
import type { User } from '../api/listUsers'
import type { ReactNode } from 'react'

export interface UserListItemProps {
  userId: string | undefined
  user: User | undefined
  caption?: string
  rightContent?: ReactNode
  rightActionOnHover?: ReactNode
  onClick?: () => void
  selectable?: boolean
  selected?: boolean
  variant?: 'default' | 'bordered' | 'section'
  showNavigationIcon?: boolean
  badge?: string
}

export function UserListItem({
  userId,
  user,
  caption,
  rightContent,
  rightActionOnHover,
  onClick,
  selectable,
  selected,
  variant = 'bordered',
  showNavigationIcon = false,
  badge,
}: UserListItemProps) {
  const t = useT()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const { data: session } = useSessionQuery()

  const isCurrentUser = session?.active && session.userId === userId

  const getUserDisplayData = () => {
    if (!userId) {
      return {
        title: t('common.fallback.unknown_user'),
        subtitle: undefined,
      }
    }

    if (!user) {
      return {
        title: t('common.fallback.unknown_user'),
        subtitle: userId,
      }
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
    const nickname = user.username || userId

    const displayName = name || t('common.fallback.unknown_user')
    const title = isCurrentUser ? `${displayName} / ${t('common.me')}` : displayName

    return {
      title,
      subtitle: nickname,
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (showNavigationIcon && userId) {
      router.push(routes.user(userId))
    }
  }

  const { title, subtitle } = getUserDisplayData()

  const defaultRightContent = showNavigationIcon ? (
    <div className="flex items-center gap-m4">
      {badge && <Chip label={badge} variant="primary" />}
      <Icon src="/icons/icon-arrow/icon-arrow-right-md.svg" size="md" color="secondary" />
    </div>
  ) : badge ? (
    <Chip label={badge} variant="primary" />
  ) : undefined

  const baseRightContent = rightContent ?? defaultRightContent
  const effectiveRightContent =
    rightActionOnHover && isHovered ? rightActionOnHover : baseRightContent

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <ListItem
        text={title}
        subtitle={subtitle}
        caption={caption}
        rightContent={effectiveRightContent}
        onClick={handleClick}
        selectable={selectable}
        selected={selected}
        variant={variant}
      />
    </div>
  )
}
