'use client'

import { useRouter } from 'next/navigation'
import { useT } from '@/shared/i18n/useT'
import { Button } from '@/shared/ui/Button'
import { useLogoutMutation } from '@/features/auth/model/hooks'

export function LogoutButton({ className }: { className?: string }) {
  const t = useT()
  const router = useRouter()
  const logout = useLogoutMutation()

  return (
    <Button
      className={className}
      variant="secondary"
      size="md"
      type="button"
      text={t('profile.actions.logout')}
      disabled={logout.isPending}
      onClick={async () => {
        try {
          await logout.mutateAsync()
        } finally {
          router.push('/login')
          router.refresh()
        }
      }}
    />
  )
}
