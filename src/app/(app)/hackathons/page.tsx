import { getServerI18n } from '@/shared/i18n/server'
import { getServerSession } from '@/entities/auth/model/server'
import { routes } from '@/shared/config/routes'
import { HackathonList } from '@/features/hackathon-list/ui/HackathonList'
import { Button, PageContainer } from '@/shared/ui'
import Link from 'next/link'

export default async function HackathonsPage() {
  const { t } = await getServerI18n(['hackathons'])
  const session = await getServerSession()

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-m12">
        <h1 className="typography-heading-lg text-text-primary">{t('hackathons.list.title')}</h1>
        {session.active ? (
          <Button variant="primary" text={t('hackathons.create.title')} asChild>
            <Link href={routes.hackathons.create} />
          </Button>
        ) : (
          <Button
            variant="secondary"
            text={t('hackathons.create.auth_required')}
            disabled
            title={t('hackathons.create.auth_required_tooltip')}
          />
        )}
      </div>
      <HackathonList />
    </PageContainer>
  )
}
