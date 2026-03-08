import { getServerI18n } from '@/shared/i18n/server'
import { getHackathonList } from '@/entities/hackathon/api/getHackathonList'
import { HackathonList } from '@/features/hackathon-list/ui/HackathonList'
import { PageContainer } from '@/shared/ui'

export default async function HackathonsPage() {
  const { t } = await getServerI18n(['hackathons'])

  let initialData
  try {
    initialData = await getHackathonList()
  } catch (error) {
    console.error('Failed to fetch hackathons:', error)
  }

  return (
    <PageContainer>
      <h1 className="typography-heading-lg text-text-primary mb-m12">
        {t('hackathons.list.title')}
      </h1>
      <HackathonList initialData={initialData} />
    </PageContainer>
  )
}
