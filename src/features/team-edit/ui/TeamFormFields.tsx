'use client'

import { InputLabel, TextareaLabel, SwitchField } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'

export interface TeamFormFieldsProps {
  name: string
  onNameChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  isJoinable: boolean
  onIsJoinableChange: (value: boolean) => void
  fillHeight?: boolean
  nameAutoFocus?: boolean
  descriptionRows?: number
}

export function TeamFormFields({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  isJoinable,
  onIsJoinableChange,
  fillHeight = false,
  nameAutoFocus = false,
  descriptionRows = 4,
}: TeamFormFieldsProps) {
  const t = useT()

  return (
    <div className="flex flex-col gap-m6">
      <InputLabel
        label={t('teams.create.name')}
        inputPlaceholder={t('teams.create.namePlaceholder')}
        inputProps={{
          value: name,
          onChange: e => onNameChange(e.target.value),
          autoFocus: nameAutoFocus,
        }}
      />
      <TextareaLabel
        fillHeight={fillHeight}
        label={t('teams.create.description')}
        textareaPlaceholder={t('teams.create.descriptionPlaceholder')}
        textareaProps={{
          value: description,
          onChange: e => onDescriptionChange(e.target.value),
          rows: descriptionRows,
        }}
      />
      <SwitchField
        checked={isJoinable}
        onChange={onIsJoinableChange}
        label={t('teams.create.isJoinable')}
      />
    </div>
  )
}
