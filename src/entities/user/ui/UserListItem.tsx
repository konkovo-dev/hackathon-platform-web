import { ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
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
}: UserListItemProps) {
  const t = useT()

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

  const { title, subtitle } = getUserDisplayData()

  return (
    <ListItem
      text={title}
      subtitle={subtitle}
      caption={caption}
      rightContent={rightContent}
      onClick={onClick}
      selectable={selectable}
      selected={selected}
      variant={variant}
    />
  )
}
