import { getServerI18n } from '@/shared/i18n/server'
import { PageContainer } from '@/shared/ui'
import { InvitationsList } from '@/features/invitations-management'

export default async function InvitationsPage() {
  const { t } = await getServerI18n(['invitations'])

  return (
    <PageContainer>
      <InvitationsList />
    </PageContainer>
  )
}
