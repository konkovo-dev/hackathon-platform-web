'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useT } from '@/shared/i18n/useT'
import { Button } from '@/shared/ui/Button'
import { InputLabel } from '@/shared/ui/InputLabel'
import { useRegisterMutation } from '../model/hooks'

export function RegisterForm() {
  const t = useT()
  const router = useRouter()
  const registerMutation = useRegisterMutation()

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', [])

  const alertRole = 'alert' as const
  const ariaLivePolite = 'polite' as const
  const usernameId = 'username' as const
  const firstNameId = 'firstName' as const
  const lastNameId = 'lastName' as const
  const emailId = 'email' as const
  const passwordId = 'password' as const
  const confirmPasswordId = 'confirmPassword' as const

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<{
    username?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    password?: boolean
    confirmPassword?: boolean
  }>({})

  const isPending = registerMutation.isPending

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-bg-surface p-m16">
      <form
        className="flex flex-col w-full max-w-[364px] items-center justify-center gap-m10"
        onSubmit={async (e) => {
          e.preventDefault()
          setFormError(null)
          setFieldError({})

          const usernameMissing = !username.trim()
          const emailMissing = !email.trim()
          const firstNameMissing = !firstName.trim()
          const lastNameMissing = !lastName.trim()
          const passwordMissing = !password

          if (usernameMissing || emailMissing || firstNameMissing || lastNameMissing || passwordMissing) {
            setFieldError({
              username: usernameMissing,
              email: emailMissing,
              firstName: firstNameMissing,
              lastName: lastNameMissing,
              password: passwordMissing,
            })
            setFormError(t('auth.errors.required'))
            return
          }

          if (password !== confirmPassword) {
            setFieldError({ confirmPassword: true })
            setFormError(t('auth.errors.password_mismatch'))
            return
          }

          try {
            await registerMutation.mutateAsync({
              username,
              email,
              password,
              firstName,
              lastName,
              timezone,
            })

            router.push('/profile')
          } catch (err) {
            const message = err instanceof Error ? err.message : t('auth.errors.unknown')
            setFormError(message)
          }
        }}
      >
        <div className="typography-title-lg text-text-primary relative w-fit whitespace-nowrap">
          {t('auth.register.title')}
        </div>

        <div className="flex flex-col items-end justify-center gap-m8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-m6 self-stretch w-full relative flex-[0_0_auto]">
            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId={usernameId}
              inputPlaceholder={t('auth.register.username.placeholder')}
              label={t('auth.register.username.label')}
              inputProps={{
                name: usernameId,
                autoComplete: 'username',
                value: username,
                onChange: (e) => setUsername(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.username === true}
            />

            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId={firstNameId}
              inputPlaceholder={t('auth.register.first_name.placeholder')}
              label={t('auth.register.first_name.label')}
              inputProps={{
                name: firstNameId,
                autoComplete: 'given-name',
                value: firstName,
                onChange: (e) => setFirstName(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.firstName === true}
            />

            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId={lastNameId}
              inputPlaceholder={t('auth.register.last_name.placeholder')}
              label={t('auth.register.last_name.label')}
              inputProps={{
                name: lastNameId,
                autoComplete: 'family-name',
                value: lastName,
                onChange: (e) => setLastName(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.lastName === true}
            />

            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId={emailId}
              inputPlaceholder={t('auth.register.email.placeholder')}
              label={t('auth.register.email.label')}
              inputProps={{
                name: emailId,
                autoComplete: 'email',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.email === true}
            />

            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId={passwordId}
              inputPlaceholder={t('auth.register.password.placeholder')}
              label={t('auth.register.password.label')}
              inputType="password"
              inputProps={{
                name: passwordId,
                autoComplete: 'new-password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.password === true}
            />

            <InputLabel
              className="self-stretch flex-[0_0_auto] w-full"
              inputId={confirmPasswordId}
              inputPlaceholder={t('auth.register.confirm_password.placeholder')}
              label={t('auth.register.confirm_password.label')}
              inputType="password"
              inputProps={{
                name: confirmPasswordId,
                autoComplete: 'new-password',
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                disabled: isPending,
              }}
              error={fieldError.confirmPassword === true}
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
          <Button className="flex-1 flex grow" variant="secondary-action" text={t('common.actions.login')} asChild>
            <Link href="/login" />
          </Button>
          <Button
            className="flex-1 flex grow"
            variant="action"
            text={t('common.actions.register')}
            type="submit"
            disabled={isPending}
          />
        </div>
      </form>
    </div>
  )
}
