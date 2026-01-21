import { getServerI18n } from '@/shared/i18n/server'

export default async function ProfilePage() {
  const { t } = await getServerI18n(['profile'])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('profile.title')}</h1>
      <div className="text-text-secondary">
        <p>{t('profile.empty')}</p>
      </div>
    </div>
  )
}
