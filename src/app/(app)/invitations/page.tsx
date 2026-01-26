import { getServerI18n } from '@/shared/i18n/server'

export default async function InvitationsPage() {
  const { t } = await getServerI18n(['invitations'])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('invitations.title')}</h1>
      <div className="text-text-secondary">
        <p>{t('invitations.empty')}</p>
      </div>
    </div>
  )
}
