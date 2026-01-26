import { getServerI18n } from '@/shared/i18n/server'

export default async function HackathonsPage() {
  const { t } = await getServerI18n(['hackathons'])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('hackathons.list.title')}</h1>
      <div className="text-text-secondary">
        <p>{t('hackathons.list.empty')}</p>
      </div>
    </div>
  )
}
