import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Radio } from './Radio'

describe('Radio', () => {
  it('should render with label', () => {
    renderWithProviders(<Radio name="option" label="Option 1" />)
    expect(screen.getByLabelText(/option 1/i)).toBeInTheDocument()
  })

  it('should be checked when checked prop is true', () => {
    renderWithProviders(<Radio name="option" label="Test" checked onChange={vi.fn()} />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('should be unchecked by default', () => {
    renderWithProviders(<Radio name="option" label="Test" />)
    expect(screen.getByRole('radio')).not.toBeChecked()
  })

  it('should call onChange when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<Radio name="option" label="Test" onChange={handleChange} />)

    await user.click(screen.getByRole('radio'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be disabled', () => {
    renderWithProviders(<Radio name="option" label="Test" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<Radio name="option" label="Test" disabled onChange={handleChange} />)

    await user.click(screen.getByRole('radio'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should render without label', () => {
    const { container } = renderWithProviders(<Radio name="option" />)
    expect(container.querySelector('input[type="radio"]')).toBeInTheDocument()
  })
})
