import { getServerI18n } from '@/shared/i18n/server'
import { getServerSession } from '@/entities/auth/model/server'
import { getMe } from '@/entities/user/api/getMe'
import { ProfileClient } from '@/features/profile/ui/ProfileClient'

export default async function ProfilePage() {
  const { t } = await getServerI18n(['profile'])
  const session = await getServerSession()

  if (!session.active) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="mb-6 text-3xl font-bold">{t('profile.title')}</h1>
        <p className="text-text-secondary">{t('profile.auth_required')}</p>
      </div>
    )
  }

  let initialData
  try {
    initialData = await getMe()
  } catch {
    // Client will retry on mount
  }

  return (
    <div className="flex justify-center w-full py-m32 px-m16">
      <ProfileClient initialData={initialData} />
    </div>
  )
}
