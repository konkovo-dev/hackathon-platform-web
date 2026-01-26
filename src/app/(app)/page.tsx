import Link from 'next/link'
import { getServerI18n } from '@/shared/i18n/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const debug = cookies().get('hp_debug')?.value === '1'
  if (debug) {
    redirect('/design-system')
  }

  const { t } = await getServerI18n(['home'])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="typography-display-xl">{t('home.title')}</h1>
        <p className="typography-body-md-regular text-text-secondary">{t('home.subtitle')}</p>

        <nav className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-brand-primary px-4 py-2 text-text-inverse hover:bg-brand-primary-hover"
          >
            {t('home.nav.login')}
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-bg-elevated px-4 py-2 text-text-primary hover:bg-bg-hover"
          >
            {t('home.nav.register')}
          </Link>
          <Link
            href="/hackathons"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            {t('home.nav.hackathons')}
          </Link>
          <Link
            href="/profile"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            {t('home.nav.profile')}
          </Link>
          <Link
            href="/invitations"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            {t('home.nav.invitations')}
          </Link>
          <Link
            href="/my-teams"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            {t('home.nav.my_teams')}
          </Link>
          <Link
            href="/design-system"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            {t('home.nav.design_system')}
          </Link>
        </nav>
      </div>
    </div>
  )
}
