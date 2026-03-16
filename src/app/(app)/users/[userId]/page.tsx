import { redirect } from 'next/navigation'
import { getServerI18n } from '@/shared/i18n/server'
import { getServerSession } from '@/entities/auth/model/server'
import { getUserById } from '@/entities/user/api/getUserById'
import { PublicProfileClient } from '@/features/public-profile/ui/PublicProfileClient'
import { PageContainer } from '@/shared/ui'
import { routes } from '@/shared/config/routes'

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const { t } = await getServerI18n(['public_profile'])
  const session = await getServerSession()

  if (session.active && session.userId === params.userId) {
    redirect(routes.profile)
  }

  let initialData
  try {
    initialData = await getUserById(params.userId)
  } catch {
    // Client will retry on mount
  }

  return (
    <PageContainer>
      <PublicProfileClient userId={params.userId} initialData={initialData} />
    </PageContainer>
  )
}
