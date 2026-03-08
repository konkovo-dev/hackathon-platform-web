import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@tests/setup/test-utils'
import { HackathonCard } from './HackathonCard'
import type { Hackathon } from '@/entities/hackathon/model/types'

const mockHackathon: Hackathon = {
  hackathonId: '1',
  name: 'Test Hackathon',
  location: {
    online: true,
    city: 'Moscow',
  },
  dates: {
    startsAt: '2026-03-15T00:00:00Z',
    endsAt: '2026-03-17T00:00:00Z',
  },
  limits: {
    teamSizeMax: 5,
  },
  registrationPolicy: {
    allowIndividual: true,
    allowTeam: true,
  },
  stage: 'UPCOMING',
  state: 'PUBLISHED',
}

describe('HackathonCard', () => {
  it('renders hackathon name', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    expect(screen.getByText('Test Hackathon')).toBeInTheDocument()
  })

  it('renders location', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    expect(screen.getByText('online / Moscow')).toBeInTheDocument()
  })

  it('renders date range', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    const dateText = screen.getByText(/15-17/)
    expect(dateText).toBeInTheDocument()
  })

  it('renders team size', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    expect(screen.getByText(/5/)).toBeInTheDocument()
  })

  it('renders stage with progress icon', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    const progressIcon = document.querySelector('[aria-label="Progress 1 out of 6"]')
    expect(progressIcon).toBeInTheDocument()
  })

  it('renders details button', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
