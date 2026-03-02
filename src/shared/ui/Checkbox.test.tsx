import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('should render with label', () => {
    renderWithProviders(<Checkbox id="test" label="Accept terms" />)
    expect(screen.getByLabelText(/accept terms/i)).toBeInTheDocument()
  })

  it('should be checked when checked prop is true', () => {
    renderWithProviders(<Checkbox id="test" label="Test" checked />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should be unchecked by default', () => {
    renderWithProviders(<Checkbox id="test" label="Test" />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should call onChange when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<Checkbox id="test" label="Test" onChange={handleChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be disabled', () => {
    renderWithProviders(<Checkbox id="test" label="Test" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<Checkbox id="test" label="Test" disabled onChange={handleChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).not.toHaveBeenCalled()
  })
})
