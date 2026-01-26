import { getServerI18n } from '@/shared/i18n/server'
import { getServerSession } from '@/entities/auth/model/server'
import { getMe, getUserDisplayName } from '@/entities/user/api/getMe'
import { toApiErrorData } from '@/shared/api/errors'
import { LogoutButton } from '@/features/auth/ui/LogoutButton'

export default async function ProfilePage() {
  const { t } = await getServerI18n(['profile'])
  const session = await getServerSession()

  if (!session.active) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="mb-6 text-3xl font-bold">{t('profile.title')}</h1>
        <div className="text-text-secondary">
          <p>{t('profile.auth_required')}</p>
        </div>
      </div>
    )
  }

  let meError: string | null = null
  let displayName = session.userId

  try {
    const me = await getMe()
    displayName = getUserDisplayName(me, session.userId)
  } catch (e) {
    const err = toApiErrorData(e)
    meError = err.message
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('profile.title')}</h1>
      <div className="text-text-secondary">
        <p>{t('profile.signed_in_as', { name: displayName })}</p>
        {meError && <p className="mt-m4">{t('profile.me_load_failed', { message: meError })}</p>}
      </div>

      <div className="mt-m8">
        <LogoutButton />
      </div>
    </div>
  )
}
