import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Section } from './Section'

describe('Section', () => {
  it('should render title', () => {
    renderWithProviders(
      <Section title="Test Section">
        <p>Content</p>
      </Section>
    )
    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('should render children', () => {
    renderWithProviders(
      <Section title="Test">
        <p>Child content</p>
      </Section>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('should render action slot when provided', () => {
    renderWithProviders(
      <Section title="Test" action={<button>Edit</button>}>
        <p>Content</p>
      </Section>
    )
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })
})
