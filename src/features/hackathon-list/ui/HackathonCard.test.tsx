import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@tests/setup/test-utils'
import { HackathonCard, HACKATHON_CARD_METRICS_VARIANT } from './HackathonCard'
import type { Hackathon } from '@/entities/hackathon/model/types'
import type { components } from '@/shared/api/platform.schema'

const PARTICIPATION_INDIVIDUAL: components['schemas']['v1ParticipationStatus'] = 'PART_INDIVIDUAL'

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
  state: 'HACKATHON_STATE_PUBLISHED',
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

  it('renders participation when metricsVariant is participant', () => {
    renderWithProviders(
      <HackathonCard
        hackathon={mockHackathon}
        metricsVariant={HACKATHON_CARD_METRICS_VARIANT.participant}
        participationStatus={PARTICIPATION_INDIVIDUAL}
      />
    )
    expect(screen.getByText('hackathons.card.participation.individual')).toBeInTheDocument()
  })

  it('does not render participation row in catalog mode even if status is passed', () => {
    renderWithProviders(
      <HackathonCard hackathon={mockHackathon} participationStatus={PARTICIPATION_INDIVIDUAL} />
    )
    expect(screen.queryByText('hackathons.card.participation.individual')).not.toBeInTheDocument()
  })

  it('hides team size in participant metrics mode', () => {
    renderWithProviders(
      <HackathonCard
        hackathon={mockHackathon}
        metricsVariant={HACKATHON_CARD_METRICS_VARIANT.participant}
        participationStatus={PARTICIPATION_INDIVIDUAL}
      />
    )
    expect(screen.queryByText('hackathons.card.teamSize')).not.toBeInTheDocument()
  })

  it('renders team size limit when set', () => {
    renderWithProviders(<HackathonCard hackathon={mockHackathon} />)
    expect(screen.getByText('hackathons.card.teamSize')).toBeInTheDocument()
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
