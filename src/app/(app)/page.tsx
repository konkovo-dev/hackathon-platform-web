import { getServerI18n } from '@/shared/i18n/server'
import { routes } from '@/shared/config/routes'
import { getServerSession } from '@/entities/auth/model/server'
import { Dashboard } from '@/widgets/dashboard'
import { Button, Logo } from '@/shared/ui'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession()
  const { t } = await getServerI18n(['home', 'dashboard'])

  if (session?.active) {
    return <Dashboard />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <p className="typography-body-md-regular text-text-secondary">{t('home.subtitle')}</p>

        <nav className="flex flex-wrap justify-center gap-4">
          <Link href={routes.auth.login}>
            <Button variant="primary" size="lg">
              {t('home.login')}
            </Button>
          </Link>
          <Link href={routes.auth.register}>
            <Button variant="secondary" size="lg">
              {t('home.register')}
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}
