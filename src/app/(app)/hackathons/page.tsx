import { getServerI18n } from '@/shared/i18n/server'
import { HackathonList } from '@/features/hackathon-list/ui/HackathonList'
import { PageContainer } from '@/shared/ui'

export default async function HackathonsPage() {
  const { t } = await getServerI18n(['hackathons'])

  return (
    <PageContainer>
      <h1 className="typography-heading-lg text-text-primary mb-m12">
        {t('hackathons.list.title')}
      </h1>
      <HackathonList />
    </PageContainer>
  )
}
