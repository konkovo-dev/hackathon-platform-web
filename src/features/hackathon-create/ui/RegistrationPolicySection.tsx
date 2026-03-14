'use client'

import { Chip, ChipList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'

interface RegistrationPolicySectionProps {
  allowIndividual: boolean
  setAllowIndividual: (value: boolean) => void
  allowTeam: boolean
  setAllowTeam: (value: boolean) => void
  disabled: boolean
}

export function RegistrationPolicySection({
  allowIndividual,
  setAllowIndividual,
  allowTeam,
  setAllowTeam,
  disabled,
}: RegistrationPolicySectionProps) {
  const t = useT()

  return (
    <ChipList>
      <Chip
        label={t('hackathons.create.fields.allowTeam')}
        variant={allowTeam ? 'primary' : 'secondary'}
        onClick={() => !disabled && setAllowTeam(!allowTeam)}
      />
      <Chip
        label={t('hackathons.create.fields.allowIndividual')}
        variant={allowIndividual ? 'primary' : 'secondary'}
        onClick={() => !disabled && setAllowIndividual(!allowIndividual)}
      />
    </ChipList>
  )
}
