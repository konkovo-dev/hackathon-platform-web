import { getServerI18n } from '@/shared/i18n/server'
import { PageContainer } from '@/shared/ui'
import { TeamsList } from '@/features/teams-list'
import { CreateTeamButton } from '@/features/team-create'

export default async function HackathonTeamsPage({
  params,
}: {
  params: Promise<{ hackathonId: string }>
}) {
  const { hackathonId } = await params
  const { t } = await getServerI18n(['teams', 'hackathons'])

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-m8">
        <h1 className="typography-title-lg text-text-primary">{t('teams.list.title')}</h1>
        <CreateTeamButton hackathonId={hackathonId} />
      </div>

      <TeamsList hackathonId={hackathonId} />
    </PageContainer>
  )
}
