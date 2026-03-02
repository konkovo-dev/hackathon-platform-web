import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Switch } from './Switch'

describe('Switch', () => {
  it('should render', () => {
    renderWithProviders(<Switch id="test" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('should be checked when checked prop is true', () => {
    renderWithProviders(<Switch id="test" checked />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should be unchecked by default', () => {
    renderWithProviders(<Switch id="test" />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should call onChange when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<Switch id="test" onChange={handleChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be disabled', () => {
    renderWithProviders(<Switch id="test" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
