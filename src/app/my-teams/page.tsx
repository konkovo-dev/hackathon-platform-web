import { getServerI18n } from '@/shared/i18n/server'

export default async function MyTeamsPage() {
  const { t } = await getServerI18n(['teams'])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('teams.my.title')}</h1>
      <div className="text-text-secondary">
        <p>{t('teams.my.empty')}</p>
      </div>
    </div>
  )
}
