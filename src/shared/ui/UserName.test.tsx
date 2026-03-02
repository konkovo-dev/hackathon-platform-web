import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@tests/setup/test-utils'
import { UserName } from './UserName'

describe('UserName', () => {
  it('should render full name', () => {
    renderWithProviders(<UserName firstName="Иван" lastName="Иванов" username="ivan" />)
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
  })

  it('should render username', () => {
    renderWithProviders(<UserName firstName="Иван" lastName="Иванов" username="ivan" />)
    expect(screen.getByText(/ivan/)).toBeInTheDocument()
  })

  it('should handle missing lastName', () => {
    renderWithProviders(<UserName firstName="Иван" lastName={null} username="ivan" />)
    expect(screen.getByText('Иван')).toBeInTheDocument()
  })

  it('should handle missing firstName', () => {
    renderWithProviders(<UserName firstName={null} lastName="Иванов" username="ivan" />)
    expect(screen.getByText('Иванов')).toBeInTheDocument()
  })

  it('should fallback to username when no name provided', () => {
    renderWithProviders(<UserName firstName={null} lastName={null} username="ivan" />)
    expect(screen.getByText(/ivan/)).toBeInTheDocument()
  })
})
