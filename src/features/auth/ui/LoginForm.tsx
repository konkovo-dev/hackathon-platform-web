'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useT } from '@/shared/i18n/useT'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { InputLabel } from '@/shared/ui/InputLabel'
import { ApiError } from '@/shared/api/errors'
import { useLoginMutation } from '../model/hooks'

function getAuthErrorText(t: ReturnType<typeof useT>, code: string): string {
  switch (code) {
    case 'INVALID_CREDENTIALS':
      return t('auth.errors.invalid_credentials')
    case 'AUTH_REQUIRED':
      return t('auth.errors.auth_required')
    case 'INVALID_PAYLOAD':
      return t('auth.errors.required')
    default:
      return t('auth.errors.unknown')
  }
}

export function LoginForm() {
  const t = useT()
  const router = useRouter()
  const loginMutation = useLoginMutation()

  const alertRole = 'alert' as const
  const ariaLivePolite = 'polite' as const

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<{ login?: boolean; password?: boolean }>({})

  const isPending = loginMutation.isPending

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-bg-surface p-m16">
      <form
        className="flex flex-col w-full max-w-[364px] items-center justify-center gap-m10"
        onSubmit={async (e) => {
          e.preventDefault()
          setFormError(null)
          setFieldError({})

          const loginMissing = !login.trim()
          const passwordMissing = !password

          if (loginMissing || passwordMissing) {
            setFieldError({ login: loginMissing, password: passwordMissing })
            setFormError(t('auth.errors.required'))
            return
          }

          try {
            await loginMutation.mutateAsync({ login, password })
            router.push('/profile')
          } catch (err) {
            const api = err instanceof ApiError ? err.data : null

            const loginErr = api?.fieldErrors?.login?.length
            const passwordErr = api?.fieldErrors?.password?.length
            if (loginErr || passwordErr) {
              setFieldError({ login: Boolean(loginErr), password: Boolean(passwordErr) })
            }

            if (api?.code) {
              setFormError(getAuthErrorText(t, api.code))
              return
            }

            setFormError((api?.message && api.message.trim()) || t('auth.errors.unknown'))
          }
        }}
      >
        <div className="typography-title-lg text-text-primary relative w-fit whitespace-nowrap">
          {t('auth.title')}
        </div>

        <div className="flex flex-col items-end justify-center gap-m8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-m6 self-stretch w-full relative flex-[0_0_auto]">
            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId="login"
              inputPlaceholder={t('auth.login.placeholder')}
              label={t('auth.login.label')}
              inputProps={{
                name: 'login',
                autoComplete: 'username',
                value: login,
                onChange: (e) => setLogin(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.login === true}
            />
            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId="password"
              inputPlaceholder={t('auth.password.placeholder')}
              label={t('auth.password.label')}
              inputType="password"
              inputProps={{
                name: 'password',
                autoComplete: 'current-password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.password === true}
            />
            <Checkbox
              label={t('auth.remember_me')}
              disabled={isPending}
            />
          </div>
        </div>

        {formError && (
          <div
            className="w-full typography-caption-sm-regular text-state-error"
            role={alertRole}
            aria-live={ariaLivePolite}
          >
            {formError}
          </div>
        )}

        <div className="flex items-center gap-m4 self-stretch w-full relative flex-[0_0_auto]">
          <Button className="flex-1 flex grow" variant="secondary-action" text={t('common.actions.register')} asChild>
            <Link href="/register" />
          </Button>
          <Button
            className="flex-1 flex grow"
            variant="action"
            text={t('common.actions.login')}
            type="submit"
            disabled={isPending}
          />
        </div>
      </form>
    </div>
  )
}
