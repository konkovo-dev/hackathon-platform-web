import { getServerI18n } from '@/shared/i18n/server'
import { PageContainer } from '@/shared/ui'
import { getMe } from '@/entities/user/api/getMe'
import { TeamDetailView } from '@/widgets/team-detail'

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ hackathonId: string; teamId: string }>
}) {
  const { hackathonId, teamId } = await params
  await getServerI18n(['teams'])

  const currentUser = await getMe()

  return (
    <PageContainer>
      <TeamDetailView
        hackathonId={hackathonId}
        teamId={teamId}
        currentUserId={currentUser.user?.userId}
      />
    </PageContainer>
  )
}
