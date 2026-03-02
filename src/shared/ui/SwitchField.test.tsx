import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { SwitchField } from './SwitchField'

describe('SwitchField', () => {
  it('should render label', () => {
    renderWithProviders(<SwitchField checked={false} onChange={vi.fn()} label="Enable notifications" />)
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('should be checked when checked prop is true', () => {
    renderWithProviders(<SwitchField checked={true} onChange={vi.fn()} label="Test" />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should be unchecked when checked prop is false', () => {
    renderWithProviders(<SwitchField checked={false} onChange={vi.fn()} label="Test" />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should call onChange when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<SwitchField checked={false} onChange={handleChange} label="Test" />)

    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('should call onChange with false when unchecking', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<SwitchField checked={true} onChange={handleChange} label="Test" />)

    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('should be disabled', () => {
    renderWithProviders(<SwitchField checked={false} onChange={vi.fn()} label="Test" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
