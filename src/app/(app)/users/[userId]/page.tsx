import { getServerI18n } from '@/shared/i18n/server'
import { PageContainer } from '@/shared/ui'

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const { t } = await getServerI18n(['common'])

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">{t('common.fallback.user_profile')}</h1>
      <div className="text-text-secondary">
        <p className="typography-body-md-regular">
          {t('common.fallback.unknown')}: {params.userId}
        </p>
        <p className="mt-4 typography-body-md-regular">{t('common.fallback.coming_soon')}</p>
      </div>
    </PageContainer>
  )
}
