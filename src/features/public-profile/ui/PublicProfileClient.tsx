'use client'

import { useT } from '@/shared/i18n/useT'
import { Button } from '@/shared/ui/Button'
import { Section } from '@/shared/ui/Section'
import { usePublicProfileQuery } from '../model/hooks'
import type { PublicProfile } from '@/entities/user/model/types'
import {
  ProfileAvatar,
  ProfileInfoSection,
  ProfileContactsSection,
  ProfileSkillsSection,
} from '@/widgets/profile-view'

interface PublicProfileClientProps {
  userId: string
  initialData?: PublicProfile
}

export function PublicProfileClient({ userId, initialData }: PublicProfileClientProps) {
  const t = useT()
  const { data: profile, isLoading } = usePublicProfileQuery(userId, initialData)

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

  return (
    <div className="flex flex-col gap-m8 items-end w-full max-w-[1080px]">
      <div className="grid gap-m8 w-full items-center" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <ProfileAvatar avatarUrl={user?.avatarUrl} firstName={user?.firstName} />

        <div className="flex flex-col gap-m8 min-w-0 justify-center">
          {/* Информация */}
          <Section title={t('public_profile.sections.info')}>
            {user ? (
              <ProfileInfoSection user={user} />
            ) : (
              <span className="typography-body-sm-regular text-text-tertiary">—</span>
            )}
          </Section>

          {/* Контакты */}
          <Section title={t('public_profile.sections.contacts')}>
            <ProfileContactsSection
              contacts={contacts}
              emptyState={
                <span className="typography-body-sm-regular text-text-tertiary">
                  {t('public_profile.contacts_hidden')}
                </span>
              }
            />
          </Section>

          {/* Навыки */}
          <Section title={t('public_profile.sections.skills')}>
            <ProfileSkillsSection
              skills={skills}
              emptyState={
                <span className="typography-body-sm-regular text-text-tertiary">
                  {t('public_profile.skills_hidden')}
                </span>
              }
            />
          </Section>
        </div>
      </div>
    </div>
  )
}
