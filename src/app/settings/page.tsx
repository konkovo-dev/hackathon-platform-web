import { getServerI18n } from '@/shared/i18n/server'

export default async function SettingsPage() {
  const { t } = await getServerI18n(['settings'])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('settings.title')}</h1>
      <div className="text-text-secondary">
        <p>{t('settings.empty')}</p>
      </div>
    </div>
  )
}
