import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { SelectListItem } from './SelectListItem'

describe('SelectListItem', () => {
  it('should render label', () => {
    renderWithProviders(<SelectListItem label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('should have role option', () => {
    renderWithProviders(<SelectListItem label="React" />)
    expect(screen.getByRole('option')).toBeInTheDocument()
  })

  it('should be selected when selected prop is true', () => {
    renderWithProviders(<SelectListItem label="React" selected />)
    const option = screen.getByRole('option')
    expect(option).toHaveAttribute('aria-selected', 'true')
  })

  it('should not be selected by default', () => {
    renderWithProviders(<SelectListItem label="React" />)
    const option = screen.getByRole('option')
    expect(option.getAttribute('aria-selected')).toBeNull()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(<SelectListItem label="React" onClick={handleClick} />)

    await user.click(screen.getByRole('option'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should show checkbox indicator', () => {
    renderWithProviders(<SelectListItem label="React" selected />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
})
