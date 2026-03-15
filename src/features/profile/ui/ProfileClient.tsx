'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { ChipList } from '@/shared/ui/ChipList'
import { Icon } from '@/shared/ui/Icon'
import { Section } from '@/shared/ui/Section'
import { LogoutButton } from '@/features/auth/ui/LogoutButton'
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useUpdateSkillsMutation,
  useUpdateContactsMutation,
} from '../model/hooks'
import { EditNameSection } from './EditNameSection'
import { EditSkillsModal } from './EditSkillsModal'
import { EditContactsModal } from './EditContactsModal'
import type { MeProfile, ContactType, VisibilityLevel } from '@/entities/user/model/types'
import { getSkillName, getContactHref } from '@/entities/user/model/types'
import type { components } from '@/shared/api/identityMe.schema'

type ContactInput = components['schemas']['v1MyContact']

const CONTACT_ICONS: Partial<Record<ContactType, string>> = {
  CONTACT_TYPE_EMAIL: '/icons/icon-mail/icon-mail-sm.svg',
  CONTACT_TYPE_TELEGRAM: '/icons/icon-telegram/icon-telegram-sm.svg',
  CONTACT_TYPE_GITHUB: '/icons/icon-github/icon-github-sm.svg',
  CONTACT_TYPE_LINKEDIN: '/icons/icon-linkedin/icon-linkedin-sm.svg',
}

function SectionIconButton({
  variant,
  onClick,
  iconSrc,
  label,
  disabled,
}: {
  variant: 'primary' | 'secondary' | 'ghost'
  onClick: () => void
  iconSrc: string
  label: string
  disabled?: boolean
}) {
  const isPrimary = variant === 'primary'
  const isSecondary = variant === 'secondary'
  const isGhost = variant === 'ghost'

  return (
    <Button
      variant="icon"
      size="xs"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        isPrimary &&
          'bg-brand-primary text-text-primary hover:bg-brand-primary-hover active:bg-brand-primary-active',
        isSecondary &&
          'border border-border-strong hover:border-border-focus active:border-border-focus',
        isGhost && 'border border-border-strong hover:border-border-focus'
      )}
    >
      <Icon src={iconSrc} size="xs" color={isPrimary ? 'primary' : 'secondary'} />
    </Button>
  )
}

interface ProfileCompletionProps {
  hasAvatar: boolean
  hasContacts: boolean
  hasSkills: boolean
}

function ProfileCompletion({ hasAvatar, hasContacts, hasSkills }: ProfileCompletionProps) {
  const t = useT()
  const items = [
    { done: hasAvatar, label: t('profile.completion.photo') },
    { done: hasContacts, label: t('profile.completion.contacts') },
    { done: hasSkills, label: t('profile.completion.skills') },
  ].sort((a, b) => Number(b.done) - Number(a.done))

  if (items.every(i => i.done)) return null

  return (
    <Section
      title={t('profile.completion.percent', {
        percent: String(Math.round((items.filter(i => i.done).length / items.length) * 100)),
      })}
    >
      <div className="flex gap-m8 items-center">
        {items.map(item => (
          <div key={item.label} className="flex flex-col gap-m6 flex-1 min-w-0">
            <span className="typography-body-sm-regular text-primary truncate">{item.label}</span>
            <div
              className={cn(
                'h-px w-full transition-all duration-300',
                item.done ? 'bg-state-success' : 'bg-border-default'
              )}
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

interface ProfileClientProps {
  initialData?: MeProfile
}

export function ProfileClient({ initialData }: ProfileClientProps) {
  const t = useT()
  const { data: profile, isLoading } = useProfileQuery(initialData)
  const updateProfile = useUpdateProfileMutation()
  const updateSkills = useUpdateSkillsMutation()
  const updateContacts = useUpdateContactsMutation()

  const [nameEditing, setNameEditing] = useState(false)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')

  const [contactsModalOpen, setContactsModalOpen] = useState(false)
  const [skillsModalOpen, setSkillsModalOpen] = useState(false)

  if (isLoading && !initialData) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="typography-body-sm-regular text-text-secondary">...</span>
      </div>
    )
  }

  const user = profile?.user
  const skills = profile?.skills ?? []
  const contacts = profile?.contacts ?? []
  const visibilityRaw = profile?.visibility
  const visibility = {
    skills: visibilityRaw?.skills ?? 'VISIBILITY_LEVEL_PUBLIC',
    contacts: visibilityRaw?.contacts ?? 'VISIBILITY_LEVEL_PUBLIC',
  } satisfies { skills: VisibilityLevel; contacts: VisibilityLevel }

  const hasAvatar = Boolean(user?.avatarUrl)
  const hasContacts = contacts.length > 0
  const hasSkills = skills.length > 0

  // --- Имя ---
  const handleNameEdit = () => {
    setEditFirstName(user?.firstName ?? '')
    setEditLastName(user?.lastName ?? '')
    setNameEditing(true)
  }
  const handleNameCancel = () => setNameEditing(false)
  const handleNameSave = async () => {
    await updateProfile.mutateAsync({
      firstName: editFirstName,
      lastName: editLastName,
      timezone: user?.timezone,
    })
    setNameEditing(false)
  }

  // --- Контакты ---
  const handleContactsSave = async (
    contactInputs: ContactInput[],
    contactsVisibility: VisibilityLevel
  ) => {
    await updateContacts.mutateAsync({
      contacts: contactInputs,
      contactsVisibility,
    })
    setContactsModalOpen(false)
  }

  // --- Навыки ---
  const handleSkillsSave = async (skillNames: string[], skillsVisibility: VisibilityLevel) => {
    await updateSkills.mutateAsync({
      catalogSkillIds: [],
      userSkills: skillNames,
      skillsVisibility,
    })
    setSkillsModalOpen(false)
  }

  // --- Хедер-кнопки ---
  const sectionEditActions = (onCancel: () => void, onSave: () => void, isPending: boolean) => (
    <>
      <SectionIconButton
        variant="secondary"
        onClick={onCancel}
        iconSrc="/icons/icon-cross/icon-cross-xs.svg"
        label={t('profile.actions.cancel')}
        disabled={isPending}
      />
      <SectionIconButton
        variant="primary"
        onClick={onSave}
        iconSrc="/icons/icon-tick/icon-tick-xs.svg"
        label={t('profile.actions.save')}
        disabled={isPending}
      />
    </>
  )

  const sectionHoverEdit = (onClick: () => void) => (
    <SectionIconButton
      variant="ghost"
      onClick={onClick}
      iconSrc="/icons/icon-edit/icon-edit-xs.svg"
      label={t('profile.actions.edit')}
    />
  )

  return (
    <div className="flex flex-col gap-m8 items-end w-full max-w-[1080px]">
      <div className="w-full">
        <ProfileCompletion hasAvatar={hasAvatar} hasContacts={hasContacts} hasSkills={hasSkills} />
      </div>

      <div className="grid gap-m8 w-full items-center" style={{ gridTemplateColumns: 'auto 1fr' }}>
        {hasAvatar ? (
          <Avatar src={user?.avatarUrl} name={user?.firstName} size="xl" />
        ) : (
          <div
            className="aspect-[3/4] self-stretch relative z-10 border border-border-default rounded-[var(--spacing-m4)] bg-bg-default overflow-hidden"
            style={{ minHeight: 0, minWidth: 0 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-m8">
              <Icon src="/icons/icon-profile/icon-profile-lg.svg" size="lg" color="secondary" />
              <Button variant="action" size="sm">
                {t('profile.actions.choose_avatar')}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-m8 min-w-0 justify-center">
          {/* Информация */}
          <Section
            title={t('profile.sections.info')}
            action={
              nameEditing
                ? sectionEditActions(handleNameCancel, handleNameSave, updateProfile.isPending)
                : undefined
            }
            hoverAction={!nameEditing && user ? sectionHoverEdit(handleNameEdit) : undefined}
          >
            {user ? (
              <EditNameSection
                user={user}
                editing={nameEditing}
                firstName={editFirstName}
                lastName={editLastName}
                onFirstNameChange={setEditFirstName}
                onLastNameChange={setEditLastName}
                isPending={updateProfile.isPending}
              />
            ) : (
              <span className="typography-body-sm-regular text-text-tertiary">—</span>
            )}
          </Section>

          {/* Контакты */}
          <Section
            title={t('profile.sections.contacts')}
            hoverAction={sectionHoverEdit(() => setContactsModalOpen(true))}
          >
            {hasContacts ? (
              <ChipList>
                {contacts.map(({ contact }, idx) => {
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
            ) : (
              <Button
                variant="action"
                size="sm"
                className="self-start"
                onClick={() => setContactsModalOpen(true)}
              >
                {t('profile.actions.add_contacts')}
              </Button>
            )}
          </Section>

          {/* Навыки */}
          <Section
            title={t('profile.sections.skills')}
            hoverAction={sectionHoverEdit(() => setSkillsModalOpen(true))}
          >
            {hasSkills ? (
              <ChipList>
                {skills.map(skill => {
                  const name = getSkillName(skill)
                  return <Chip key={name} label={name} />
                })}
              </ChipList>
            ) : (
              <Button
                variant="action"
                size="sm"
                className="self-start"
                onClick={() => setSkillsModalOpen(true)}
              >
                {t('profile.actions.add_skills')}
              </Button>
            )}
          </Section>
        </div>
      </div>

      <Section title={t('profile.sections.hackathons')} className="w-full">
        <Button
          variant="action"
          size="sm"
          className="self-start"
          asChild
          text={t('profile.hackathons.find')}
        >
          <Link href={routes.hackathons.list} />
        </Button>
      </Section>

      <LogoutButton />

      {/* Модал контактов */}
      <EditContactsModal
        open={contactsModalOpen}
        onClose={() => setContactsModalOpen(false)}
        contacts={contacts}
        contactsVisibility={visibility.contacts}
        onSave={handleContactsSave}
        isPending={updateContacts.isPending}
      />

      {/* Модал навыков */}
      <EditSkillsModal
        open={skillsModalOpen}
        onClose={() => setSkillsModalOpen(false)}
        skills={skills}
        skillsVisibility={visibility.skills}
        onSave={handleSkillsSave}
        isPending={updateSkills.isPending}
      />
    </div>
  )
}

function ContactIcon({ src }: { src: string }) {
  return (
    <span
      className="w-m8 h-m8 block bg-icon-primary"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
      }}
    />
  )
}
