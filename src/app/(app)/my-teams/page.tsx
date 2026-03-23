import { getServerI18n } from '@/shared/i18n/server'
import { PageContainer } from '@/shared/ui'
import { MyTeamsList } from '@/widgets/my-teams-list'

export default async function MyTeamsPage() {
  const { t } = await getServerI18n(['teams'])

  return (
    <PageContainer>
      <h1 className="mb-m8 typography-heading-lg text-text-primary">{t('teams.my.title')}</h1>
      <MyTeamsList />
    </PageContainer>
  )
}
