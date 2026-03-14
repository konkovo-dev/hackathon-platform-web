'use client'

import { useState } from 'react'
import { InputLabel } from '@/shared/ui/InputLabel'
import { SwitchField } from '@/shared/ui/SwitchField'
import { CitySelectModal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { FieldErrors } from '../model/validation'

interface LocationSectionProps {
  city: string
  setCity: (value: string) => void
  venue: string
  setVenue: (value: string) => void
  online: boolean
  setOnline: (value: boolean) => void
  errors: FieldErrors
  disabled: boolean
}

export function LocationSection({
  city,
  setCity,
  venue,
  setVenue,
  online,
  setOnline,
  errors,
  disabled,
}: LocationSectionProps) {
  const t = useT()
  const [cityModalOpen, setCityModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-m6">
        <InputLabel
          label={t('hackathons.create.fields.city')}
          inputPlaceholder={t('hackathons.create.fields.city')}
          inputProps={{
            value: city,
            onChange: e => setCity(e.target.value),
            disabled,
            readOnly: true,
            onClick: () => !disabled && setCityModalOpen(true),
            style: { cursor: disabled ? 'not-allowed' : 'pointer' },
          }}
          error={errors.city}
        />

        <InputLabel
          label={t('hackathons.create.fields.venue')}
          inputPlaceholder={t('hackathons.create.fields.venue')}
          inputProps={{
            value: venue,
            onChange: e => setVenue(e.target.value),
            disabled,
          }}
          error={errors.venue}
        />

        <SwitchField
          label={t('hackathons.create.fields.online')}
          checked={online}
          onChange={setOnline}
          disabled={disabled}
        />
      </div>

      <CitySelectModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={setCity}
        currentCity={city}
      />
    </>
  )
}
