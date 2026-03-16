import { Chip } from '@/shared/ui/Chip'
import { ChipList } from '@/shared/ui/ChipList'
import { getContactHref, type ContactType, type ContactItem } from '@/entities/user/model/types'
import { CONTACT_ICONS, ContactIcon } from './ContactIcon'
import type { ReactNode } from 'react'

interface ProfileContactsSectionProps {
  contacts: ContactItem[]
  emptyState?: ReactNode
}

export function ProfileContactsSection({ contacts, emptyState }: ProfileContactsSectionProps) {
  if (contacts.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  if (contacts.length === 0) {
    return null
  }

  return (
    <ChipList>
      {contacts.map((contact, idx) => {
        if (!contact) return null
        const iconSrc = contact.type ? CONTACT_ICONS[contact.type] : undefined
        const href =
          contact.type && contact.value
            ? getContactHref(contact.type as ContactType, contact.value)
            : undefined
        return (
          <Chip
            key={contact.id || `${contact.type}-${contact.value}-${idx}`}
            label={contact.value ?? ''}
            icon={iconSrc ? <ContactIcon src={iconSrc} /> : undefined}
            href={href}
          />
        )
      })}
    </ChipList>
  )
}
