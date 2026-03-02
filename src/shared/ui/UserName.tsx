import { cn } from '@/shared/lib/cn'

export interface UserNameProps {
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  className?: string
}

export function UserName({ firstName, lastName, username, className }: UserNameProps) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

  return (
    <div className={cn('flex flex-col gap-m2', className)}>
      <span className="typography-body-lg-medium text-text-primary">{fullName || '—'}</span>
      {username && (
        <span className="typography-body-sm-regular text-text-secondary">/ {username}</span>
      )}
    </div>
  )
}
