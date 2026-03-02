import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { mockUser } from '../fixtures/mockUser'
import { mockSkills } from '../fixtures/mockSkills'

export const handlers = [
  // ===== Auth endpoints =====
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/session', () => {
    return HttpResponse.json(mockUser)
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
      skillsVisibility: body.skillsVisibility || mockUser.skillsVisibility,
    })
  }),

  http.put('/api/platform/v1/users/me/contacts', async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      ...mockUser,
      contacts: body.contacts || [],
      contactsVisibility: body.contactsVisibility || mockUser.contactsVisibility,
    })
  }),

  http.get('/api/platform/v1/skills/catalog', () => {
    return HttpResponse.json({ skills: mockSkills })
  }),
]

export const server = setupServer(...handlers)
