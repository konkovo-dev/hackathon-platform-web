import type { Hackathon } from '@/entities/hackathon/model/types'

export const mockHackathons: Hackathon[] = [
  {
    hackathonId: 'hack-1',
    name: 'Тестовый Хакатон 1',
    stage: 'REGISTRATION',
    state: 'PUBLISHED',
    location: {
      online: true,
      city: 'Москва',
    },
    dates: {
      startsAt: '2026-04-01T10:00:00Z',
      endsAt: '2026-04-03T18:00:00Z',
      registrationOpensAt: '2026-03-01T00:00:00Z',
      registrationClosesAt: '2026-03-31T23:59:59Z',
    },
    limits: {
      teamSizeMax: 5,
    },
    registrationPolicy: {
      allowIndividual: true,
      allowTeam: true,
    },
  },
  {
    hackathonId: 'hack-2',
    name: 'Онлайн Хакатон 2',
    stage: 'UPCOMING',
    state: 'PUBLISHED',
    location: {
      online: true,
    },
    dates: {
      startsAt: '2026-05-10T10:00:00Z',
      endsAt: '2026-05-12T18:00:00Z',
    },
    limits: {},
    registrationPolicy: {
      allowIndividual: true,
      allowTeam: true,
    },
  },
  {
    hackathonId: 'hack-3',
    name: 'Офлайн Хакатон в СПб',
    stage: 'RUNNING',
    state: 'PUBLISHED',
    location: {
      online: false,
      city: 'Санкт-Петербург',
    },
    dates: {
      startsAt: '2026-03-01T10:00:00Z',
      endsAt: '2026-03-03T18:00:00Z',
    },
    limits: {
      teamSizeMax: 4,
    },
    registrationPolicy: {
      allowIndividual: false,
      allowTeam: true,
    },
  },
]
