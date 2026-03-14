'use client'

import { Input } from '@/shared/ui/Input'
import { useT } from '@/shared/i18n/useT'
import type { FieldErrors } from '../model/validation'

interface LimitsSectionProps {
  teamSizeMax: string
  setTeamSizeMax: (value: string) => void
  errors: FieldErrors
  disabled: boolean
}

export function LimitsSection({
  teamSizeMax,
  setTeamSizeMax,
  errors,
  disabled,
}: LimitsSectionProps) {
  const t = useT()

  return (
    <Input
      type="number"
      placeholder={t('hackathons.create.fields.teamSizeMax')}
      value={teamSizeMax}
      onChange={e => setTeamSizeMax(e.target.value)}
      disabled={disabled}
      error={errors.teamSizeMax}
    />
  )
}
