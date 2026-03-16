import { ListItem, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useRouter } from 'next/navigation'
import { routes } from '@/shared/config/routes'
import type { User } from '../api/listUsers'
import type { ReactNode } from 'react'

export interface UserListItemProps {
  userId: string | undefined
  user: User | undefined
  caption?: string
  rightContent?: ReactNode
  onClick?: () => void
  selectable?: boolean
  selected?: boolean
  variant?: 'default' | 'bordered' | 'section'
  showNavigationIcon?: boolean
}

export function UserListItem({
  userId,
  user,
  caption,
  rightContent,
  onClick,
  selectable,
  selected,
  variant = 'bordered',
  showNavigationIcon = false,
}: UserListItemProps) {
  const t = useT()
  const router = useRouter()

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

    return {
      title: name || t('common.fallback.unknown_user'),
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
    <Icon src="/icons/icon-arrow/icon-arrow-right-md.svg" size="md" color="secondary" />
  ) : undefined

  return (
    <ListItem
      text={title}
      subtitle={subtitle}
      caption={caption}
      rightContent={rightContent ?? defaultRightContent}
      onClick={handleClick}
      selectable={selectable}
      selected={selected}
      variant={variant}
    />
  )
}
