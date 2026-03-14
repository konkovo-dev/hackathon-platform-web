'use client'

import { InputLabel } from '@/shared/ui/InputLabel'
import { useT } from '@/shared/i18n/useT'
import type { FieldErrors } from '../model/validation'

interface BasicInfoSectionProps {
  name: string
  setName: (value: string) => void
  shortDescription: string
  setShortDescription: (value: string) => void
  errors: FieldErrors
  disabled: boolean
}

export function BasicInfoSection({
  name,
  setName,
  shortDescription,
  setShortDescription,
  errors,
  disabled,
}: BasicInfoSectionProps) {
  const t = useT()

  return (
    <div className="flex flex-col gap-m6">
      <InputLabel
        label={t('hackathons.create.fields.name')}
        inputPlaceholder={t('hackathons.create.fields.name')}
        inputProps={{
          value: name,
          onChange: e => setName(e.target.value),
          disabled,
          required: true,
        }}
        error={errors.name}
      />
      <InputLabel
        label={t('hackathons.create.fields.shortDescription')}
        inputPlaceholder={t('hackathons.create.fields.shortDescription')}
        inputProps={{
          value: shortDescription,
          onChange: e => setShortDescription(e.target.value),
          disabled,
        }}
        error={errors.shortDescription}
      />
    </div>
  )
}
