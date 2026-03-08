'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { SwitchField } from '@/shared/ui/SwitchField'
import { useT } from '@/shared/i18n/useT'
import type { components } from '@/shared/api/identityMe.schema'
import type {
  ContactWithVisibility,
  ContactType,
  VisibilityLevel,
} from '@/entities/user/model/types'

type ContactInput = components['schemas']['v1MyContact']

const CONTACT_FIELDS: { type: ContactType; key: string }[] = [
  { type: 'CONTACT_TYPE_EMAIL', key: 'email' },
  { type: 'CONTACT_TYPE_GITHUB', key: 'github' },
  { type: 'CONTACT_TYPE_TELEGRAM', key: 'telegram' },
  { type: 'CONTACT_TYPE_LINKEDIN', key: 'linkedin' },
]

type ContactValues = Partial<Record<ContactType, string>>

function buildContactValues(contacts: ContactWithVisibility[]): ContactValues {
  const vals: ContactValues = {}
  for (const { contact } of contacts) {
    if (contact?.type) vals[contact.type] = contact.value ?? ''
  }
  return vals
}

interface EditContactsModalProps {
  open: boolean
  onClose: () => void
  contacts: ContactWithVisibility[]
  contactsVisibility: VisibilityLevel
  onSave: (contacts: ContactInput[], visibility: VisibilityLevel) => Promise<void>
  isPending: boolean
}

export function EditContactsModal({
  open,
  onClose,
  contacts,
  contactsVisibility,
  onSave,
  isPending,
}: EditContactsModalProps) {
  const t = useT()

  const [values, setValues] = useState<ContactValues>(() => buildContactValues(contacts))
  const [visibility, setVisibility] = useState<VisibilityLevel>(contactsVisibility)

  useEffect(() => {
    if (open) {
      setValues(buildContactValues(contacts))
      setVisibility(contactsVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleChange = (type: ContactType, value: string) => {
    setValues(prev => ({ ...prev, [type]: value }))
  }

  const handleSave = async () => {
    const contactInputs: ContactInput[] = CONTACT_FIELDS.flatMap(({ type }) => {
      const value = values[type]?.trim()
      if (!value) return []
      return [
        { contact: { type, value }, visibility: 'VISIBILITY_LEVEL_PUBLIC' as VisibilityLevel },
      ]
    })
    await onSave(contactInputs, visibility)
  }

  return (
    <Modal open={open} onClose={onClose} title={t('profile.edit.contacts_title')}>
      <div className="flex flex-col gap-m6">
        {CONTACT_FIELDS.map(({ type }) => (
          <FormField
            key={type}
            label={t(`profile.contact_types.${type}` as `profile.contact_types.CONTACT_TYPE_EMAIL`)}
          >
            <Input
              value={values[type] ?? ''}
              onChange={e => handleChange(type, e.target.value)}
              placeholder={type.replace('CONTACT_TYPE_', '').toLowerCase()}
            />
          </FormField>
        ))}

        <SwitchField
          checked={visibility === 'VISIBILITY_LEVEL_PUBLIC'}
          onChange={checked =>
            setVisibility(checked ? 'VISIBILITY_LEVEL_PUBLIC' : 'VISIBILITY_LEVEL_PRIVATE')
          }
          label={t('profile.visibility.contacts_label')}
        />
      </div>

      <div className="flex justify-end gap-m4 pt-m4">
        <Button variant="action" size="sm" onClick={handleSave} disabled={isPending}>
          {t('profile.actions.save')}
        </Button>
      </div>
    </Modal>
  )
}
