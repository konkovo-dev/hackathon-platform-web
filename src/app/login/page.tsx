import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { InputLabel } from '@/shared/ui/InputLabel'
import Link from 'next/link'
import { getServerI18n } from '@/shared/i18n/server'

export default async function LoginPage() {
  const { t } = await getServerI18n(['auth', 'common'])

  return (
    <div className="flex w-full h-screen items-center justify-end relative bg-bg-default">
      <div className="inline-flex flex-col items-center gap-m10 p-[120px] self-stretch bg-bg-surface relative flex-[0_0_auto]">
        <form className="flex flex-col w-[364px] items-center justify-center gap-m10 relative flex-[0_0_auto]">
          <div className="typography-title-lg text-text-primary relative w-fit whitespace-nowrap">
            {t('auth.title')}
          </div>

          <div className="flex flex-col items-end justify-center gap-m8 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-m6 self-stretch w-full relative flex-[0_0_auto]">
              <InputLabel
                className="self-stretch flex-[0_0_auto] w-full"
                inputPlaceholder={t('auth.login.placeholder')}
                label={t('auth.login.label')}
              />
              <InputLabel
                className="self-stretch flex-[0_0_auto] w-full"
                inputPlaceholder={t('auth.password.placeholder')}
                label={t('auth.password.label')}
                inputType="password"
              />
              <Checkbox label={t('auth.remember_me')} />
            </div>
          </div>

          <div className="flex items-center gap-m4 self-stretch w-full relative flex-[0_0_auto]">
            <Button
              className="flex-1 flex grow"
              variant="secondary-action"
              text={t('common.actions.register')}
              asChild
            >
              <Link href="/register" />
            </Button>
            <Button
              className="flex-1 flex grow"
              variant="action"
              text={t('common.actions.login')}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
