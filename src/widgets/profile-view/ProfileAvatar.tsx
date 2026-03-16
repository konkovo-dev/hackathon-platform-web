import { Avatar } from '@/shared/ui/Avatar'
import { Icon } from '@/shared/ui/Icon'
import type { ReactNode } from 'react'

interface ProfileAvatarProps {
  avatarUrl?: string
  firstName?: string
  size?: 'xl'
  placeholder?: ReactNode
}

export function ProfileAvatar({ avatarUrl, firstName, size = 'xl', placeholder }: ProfileAvatarProps) {
  if (avatarUrl) {
    return <Avatar src={avatarUrl} name={firstName} size={size} />
  }

  return (
    <div
      className="aspect-[3/4] self-stretch relative z-10 border border-border-default rounded-[var(--spacing-m4)] bg-bg-default overflow-hidden"
      style={{ minHeight: 0, minWidth: 0 }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-m8">
        <Icon src="/icons/icon-profile/icon-profile-lg.svg" size="lg" color="secondary" />
        {placeholder}
      </div>
    </div>
  )
}
