import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@tests/setup/test-utils'
import { ChipList } from './ChipList'
import { Chip } from './Chip'

describe('ChipList', () => {
  it('should render children', () => {
    renderWithProviders(
      <ChipList>
        <Chip label="React" />
        <Chip label="TypeScript" />
      </ChipList>
    )
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = renderWithProviders(
      <ChipList className="custom-class">
        <Chip label="React" />
      </ChipList>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should render multiple chips in flex layout', () => {
    const { container } = renderWithProviders(
      <ChipList>
        <Chip label="Chip 1" />
        <Chip label="Chip 2" />
        <Chip label="Chip 3" />
      </ChipList>
    )
    expect(container.firstChild).toHaveClass('flex', 'flex-wrap', 'gap-m4')
  })
})
