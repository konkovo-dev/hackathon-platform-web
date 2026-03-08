import { describe, it, expect } from 'vitest'
import {
  getSkillName,
  getContactTypeLabel,
  getContactHref,
  type Skill,
  type ContactType,
} from './types'

describe('getSkillName', () => {
  it('should return catalog name if present', () => {
    const skill: Skill = {
      catalog: {
        id: 'skill-1',
        name: 'React',
      },
      custom: undefined,
    }
    expect(getSkillName(skill)).toBe('React')
  })

  it('should fallback to custom name', () => {
    const skill: Skill = {
      catalog: undefined,
      custom: {
        name: 'ReactJS',
      },
    }
    expect(getSkillName(skill)).toBe('ReactJS')
  })

  it('should prefer catalog over custom name', () => {
    const skill: Skill = {
      catalog: {
        id: 'skill-1',
        name: 'React',
      },
      custom: {
        name: 'ReactJS',
      },
    }
    expect(getSkillName(skill)).toBe('ReactJS')
  })

  it('should return empty string if both are null', () => {
    const skill: Skill = {
      catalog: undefined,
      custom: undefined,
    }
    expect(getSkillName(skill)).toBe('')
  })
})

describe('getContactTypeLabel', () => {
  it('should return label for email', () => {
    expect(getContactTypeLabel('CONTACT_TYPE_EMAIL')).toBe('Email')
  })

  it('should return label for telegram', () => {
    expect(getContactTypeLabel('CONTACT_TYPE_TELEGRAM')).toBe('Telegram')
  })

  it('should return label for github', () => {
    expect(getContactTypeLabel('CONTACT_TYPE_GITHUB')).toBe('GitHub')
  })

  it('should return label for linkedin', () => {
    expect(getContactTypeLabel('CONTACT_TYPE_LINKEDIN')).toBe('LinkedIn')
  })

  it('should return original type for unknown type', () => {
    const unknownType = 'CONTACT_TYPE_UNKNOWN' as ContactType
    expect(getContactTypeLabel(unknownType)).toBe('CONTACT_TYPE_UNKNOWN')
  })
})

describe('getContactHref', () => {
  it('should create mailto link for email', () => {
    expect(getContactHref('CONTACT_TYPE_EMAIL', 'test@example.com')).toBe('mailto:test@example.com')
  })

  it('should create telegram link', () => {
    expect(getContactHref('CONTACT_TYPE_TELEGRAM', 'username')).toBe('https://t.me/username')
  })

  it('should create telegram link without @ prefix', () => {
    expect(getContactHref('CONTACT_TYPE_TELEGRAM', '@username')).toBe('https://t.me/username')
  })

  it('should create github URL', () => {
    expect(getContactHref('CONTACT_TYPE_GITHUB', 'username')).toBe('https://github.com/username')
  })

  it('should create github URL without @ prefix', () => {
    expect(getContactHref('CONTACT_TYPE_GITHUB', '@username')).toBe('https://github.com/username')
  })

  it('should create linkedin URL', () => {
    expect(getContactHref('CONTACT_TYPE_LINKEDIN', 'username')).toBe(
      'https://linkedin.com/in/username'
    )
  })

  it('should preserve full linkedin URL', () => {
    expect(getContactHref('CONTACT_TYPE_LINKEDIN', 'https://linkedin.com/in/custom-url')).toBe(
      'https://linkedin.com/in/custom-url'
    )
  })

  it('should return undefined for unknown type', () => {
    const unknownType = 'CONTACT_TYPE_UNKNOWN' as ContactType
    expect(getContactHref(unknownType, 'value')).toBeUndefined()
  })
})
