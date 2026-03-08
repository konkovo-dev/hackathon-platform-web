import { getServerI18n } from '@/shared/i18n/server'
import { getServerSession } from '@/entities/auth/model/server'
import { getMe } from '@/entities/user/api/getMe'
import { ProfileClient } from '@/features/profile/ui/ProfileClient'
import { PageContainer } from '@/shared/ui'

export default async function ProfilePage() {
  const { t } = await getServerI18n(['profile'])
  const session = await getServerSession()

  if (!session.active) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-3xl font-bold">{t('profile.title')}</h1>
        <p className="text-text-secondary">{t('profile.auth_required')}</p>
      </PageContainer>
    )
  }

  let initialData
  try {
    initialData = await getMe()
  } catch {
    // Client will retry on mount
  }

  return (
    <PageContainer>
      <ProfileClient initialData={initialData} />
    </PageContainer>
  )
}
