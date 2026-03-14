import { routes } from '@/shared/config/routes'
import { PageContainer } from '@/shared/ui'
import { HackathonCreateForm } from '@/features/hackathon-create/ui/HackathonCreateForm'

export default function CreateHackathonPage() {
  return (
    <PageContainer>
      <HackathonCreateForm />
    </PageContainer>
  )
}
