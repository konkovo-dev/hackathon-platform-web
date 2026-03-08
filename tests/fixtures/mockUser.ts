import type { MeProfile } from '@/entities/user/model/types'

export const mockUser: MeProfile = {
  user: {
    userId: 'user-1',
    username: 'testuser',
    firstName: 'Иван',
    lastName: 'Иванов',
    avatarUrl: undefined,
    timezone: 'Europe/Moscow',
  },
  skills: [
    {
      catalog: {
        id: 'skill-1',
        name: 'React',
      },
      custom: undefined,
    },
    {
      catalog: {
        id: 'skill-2',
        name: 'TypeScript',
      },
      custom: undefined,
    },
  ],
  contacts: [
    {
      contact: {
        id: 'contact-1',
        type: 'CONTACT_TYPE_EMAIL',
        value: 'test@example.com',
      },
      visibility: 'VISIBILITY_LEVEL_PUBLIC',
    },
    {
      contact: {
        id: 'contact-2',
        type: 'CONTACT_TYPE_GITHUB',
        value: 'testuser',
      },
      visibility: 'VISIBILITY_LEVEL_PUBLIC',
    },
  ],
  visibility: {
    skills: 'VISIBILITY_LEVEL_PUBLIC',
    contacts: 'VISIBILITY_LEVEL_PUBLIC',
  },
}

export const mockUserWithoutSkills: MeProfile = {
  ...mockUser,
  skills: [],
  visibility: {
    ...mockUser.visibility,
    skills: 'VISIBILITY_LEVEL_PRIVATE',
  },
}

export const mockUserWithPrivateContacts: MeProfile = {
  ...mockUser,
  contacts: [
    {
      contact: {
        id: 'contact-1',
        type: 'CONTACT_TYPE_EMAIL',
        value: 'private@example.com',
      },
      visibility: 'VISIBILITY_LEVEL_PRIVATE',
    },
  ],
  visibility: {
    ...mockUser.visibility,
    contacts: 'VISIBILITY_LEVEL_PRIVATE',
  },
}
