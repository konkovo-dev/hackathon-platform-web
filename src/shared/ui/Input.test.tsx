import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Input } from './Input'

describe('Input', () => {
  it('should render with placeholder', () => {
    renderWithProviders(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('# Enter text')).toBeInTheDocument()
  })

  it('should render search variant with icon', () => {
    renderWithProviders(<Input variant="search" placeholder="Search" />)
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    // Search variant doesn't add # prefix
  })

  it('should accept user input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Input placeholder="Type here" />)

    const input = screen.getByPlaceholderText('# Type here')
    await user.type(input, 'Hello world')

    expect(input).toHaveValue('Hello world')
  })

  it('should call onChange', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithProviders(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'a')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled', () => {
    renderWithProviders(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('should show error state', () => {
    const { container } = renderWithProviders(<Input error />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('border-state-error')
  })

  it('should render with custom type', () => {
    renderWithProviders(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('should forward ref', () => {
    const ref = vi.fn()
    renderWithProviders(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('should merge custom className', () => {
    const { container } = renderWithProviders(<Input className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should clear input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Input placeholder="Text" />)

    const input = screen.getByPlaceholderText('# Text')
    await user.type(input, 'Hello')
    expect(input).toHaveValue('Hello')

    await user.clear(input)
    expect(input).toHaveValue('')
  })
})
