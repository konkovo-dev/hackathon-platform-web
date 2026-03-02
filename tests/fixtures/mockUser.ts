import type { MeProfile } from '@/entities/user/model/types'

export const mockUser: MeProfile = {
  user: {
    id: 'user-1',
    username: 'testuser',
    firstName: 'Иван',
    lastName: 'Иванов',
    avatarUrl: null,
    timezone: 'Europe/Moscow',
  },
  skills: [
    {
      catalog: {
        id: 'skill-1',
        name: 'React',
      },
      custom: null,
    },
    {
      catalog: {
        id: 'skill-2',
        name: 'TypeScript',
      },
      custom: null,
    },
  ],
  contacts: [
    {
      type: 'CONTACT_TYPE_EMAIL',
      value: 'test@example.com',
      visibility: 'VISIBILITY_LEVEL_PUBLIC',
    },
    {
      type: 'CONTACT_TYPE_GITHUB',
      value: 'testuser',
      visibility: 'VISIBILITY_LEVEL_PUBLIC',
    },
  ],
  visibility: {
    skillsVisibility: 'VISIBILITY_LEVEL_PUBLIC',
    contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC',
  },
}

export const mockUserWithoutSkills: MeProfile = {
  ...mockUser,
  skills: [],
  visibility: {
    ...mockUser.visibility,
    skillsVisibility: 'VISIBILITY_LEVEL_PRIVATE',
  },
}

export const mockUserWithPrivateContacts: MeProfile = {
  ...mockUser,
  contacts: [
    {
      type: 'CONTACT_TYPE_EMAIL',
      value: 'private@example.com',
      visibility: 'VISIBILITY_LEVEL_PRIVATE',
    },
  ],
  visibility: {
    ...mockUser.visibility,
    contactsVisibility: 'VISIBILITY_LEVEL_PRIVATE',
  },
}
