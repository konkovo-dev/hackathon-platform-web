'use client'

import { Input } from '@/shared/ui/Input'
import { UserName } from '@/shared/ui/UserName'
import { useT } from '@/shared/i18n/useT'
import type { MeUser } from '@/entities/user/model/types'

export interface EditNameSectionProps {
  user: MeUser
  editing: boolean
  firstName: string
  lastName: string
  onFirstNameChange: (v: string) => void
  onLastNameChange: (v: string) => void
  isPending: boolean
}

export function EditNameSection({
  user,
  editing,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  isPending,
}: EditNameSectionProps) {
  const t = useT()

  if (!editing) {
    return <UserName firstName={user.firstName} lastName={user.lastName} username={user.username} />
  }

  return (
    <div className="flex gap-m4">
      <div className="flex-1">
        <Input
          value={firstName}
          onChange={e => onFirstNameChange(e.target.value)}
          placeholder={t('profile.info.first_name')}
          disabled={isPending}
        />
      </div>
      <div className="flex-1">
        <Input
          value={lastName}
          onChange={e => onLastNameChange(e.target.value)}
          placeholder={t('profile.info.last_name')}
          disabled={isPending}
        />
      </div>
    </div>
  )
}
