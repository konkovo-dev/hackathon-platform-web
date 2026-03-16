import type { components } from '@/shared/api/identityMe.schema'

export type MeUser = components['schemas']['v1User']
export type CatalogSkill = components['schemas']['v1CatalogSkill']
export type CustomSkill = components['schemas']['v1CustomSkill']
export type Skill = components['schemas']['v1Skill']
export type ContactItem = components['schemas']['identityV1Contact']
export type ContactWithVisibility = components['schemas']['v1MyContact']
export type Visibility = components['schemas']['v1VisibilitySettings']
export type VisibilityLevel = components['schemas']['v1VisibilityLevel']
export type ContactType = components['schemas']['v1ContactType']

export type MeProfile = {
  user?: MeUser
  skills: Skill[]
  contacts: ContactWithVisibility[]
  visibility: Visibility
}

export type PublicProfile = {
  user?: MeUser
  skills: Skill[]
  contacts: ContactItem[]
}

export function getSkillName(skill: Skill): string {
  return skill.custom?.name ?? skill.catalog?.name ?? ''
}

export function getContactTypeLabel(type: ContactType): string {
  const labels: Partial<Record<ContactType, string>> = {
    CONTACT_TYPE_EMAIL: 'Email',
    CONTACT_TYPE_TELEGRAM: 'Telegram',
    CONTACT_TYPE_GITHUB: 'GitHub',
    CONTACT_TYPE_LINKEDIN: 'LinkedIn',
  }
  return labels[type] ?? type
}

export function getContactHref(type: ContactType, value: string): string | undefined {
  const normalized = value.replace(/^@/, '')
  switch (type) {
    case 'CONTACT_TYPE_EMAIL':
      return `mailto:${value}`
    case 'CONTACT_TYPE_TELEGRAM':
      return `https://t.me/${normalized}`
    case 'CONTACT_TYPE_GITHUB':
      return `https://github.com/${normalized}`
    case 'CONTACT_TYPE_LINKEDIN':
      return value.startsWith('http') ? value : `https://linkedin.com/in/${normalized}`
    default:
      return undefined
  }
}
