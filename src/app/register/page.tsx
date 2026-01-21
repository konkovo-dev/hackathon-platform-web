import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import Link from 'next/link'
import { getServerI18n } from '@/shared/i18n/server'

export default async function RegisterPage() {
  const { t } = await getServerI18n(['auth'])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">{t('auth.register.title')}</h1>
          <p className="text-sm text-text-secondary">{t('auth.register.subtitle')}</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <FormField>
              <Label htmlFor="name">{t('auth.register.name.label')}</Label>
              <Input id="name" type="text" placeholder={t('auth.register.name.placeholder')} />
            </FormField>

            <FormField>
              <Label htmlFor="email">{t('auth.register.email.label')}</Label>
              <Input id="email" type="email" placeholder={t('auth.register.email.placeholder')} />
            </FormField>

            <FormField>
              <Label htmlFor="password">{t('auth.register.password.label')}</Label>
              <Input id="password" type="password" placeholder={t('auth.register.password.placeholder')} />
            </FormField>

            <FormField>
              <Label htmlFor="confirmPassword">{t('auth.register.confirm_password.label')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.register.confirm_password.placeholder')}
              />
            </FormField>

            <Button type="submit" className="w-full" variant="primary">
              {t('auth.register.submit')}
            </Button>

            <p className="text-center text-sm text-text-secondary">
              {t('auth.register.have_account')}{' '}
              <Link href="/login" className="text-link-default hover:text-link-hover hover:underline">
                {t('auth.register.login_link')}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
