import { getServerI18n } from '@/shared/i18n/server'

export default async function HackathonMainPage({
  params,
}: {
  params: Promise<{ hackathonId: string }>
}) {
  const { t } = await getServerI18n(['hackathons'])
  const { hackathonId } = await params

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t('hackathons.detail.title', { hackathonId })}</h1>
      <div className="text-text-secondary">
        <p>{t('hackathons.detail.empty')}</p>
      </div>
    </div>
  )
}
