import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { mockUser } from '../fixtures/mockUser'
import { mockSkills } from '../fixtures/mockSkills'
import { mockHackathons } from '../fixtures/mockHackathons'

export const handlers = [
  // ===== Auth endpoints =====
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      active: true,
      userId: 'user-1',
      expiresAt: '2026-04-01T00:00:00Z',
    })
  }),

  // ===== Platform API proxy =====
  http.get('/api/platform/v1/users/me', () => {
    return HttpResponse.json(mockUser)
  }),

  http.put('/api/platform/v1/users/me', async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({ ...mockUser, ...body })
  }),

  http.put('/api/platform/v1/users/me/skills', async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      ...mockUser,
      skills: body.userSkills || [],
      visibility: {
        ...mockUser.visibility,
        skills: body.skillsVisibility || mockUser.visibility.skills,
      },
    })
  }),

  http.put('/api/platform/v1/users/me/contacts', async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      ...mockUser,
      contacts: body.contacts || [],
      visibility: {
        ...mockUser.visibility,
        contacts: body.contactsVisibility || mockUser.visibility.contacts,
      },
    })
  }),

  http.get('/api/platform/v1/skills/catalog', () => {
    return HttpResponse.json({ skills: mockSkills })
  }),

  http.post('/api/platform/v1/hackathons/list', () => {
    return HttpResponse.json({
      hackathons: mockHackathons,
      page: {
        hasMore: false,
      },
    })
  }),
]

export const server = setupServer(...handlers)
