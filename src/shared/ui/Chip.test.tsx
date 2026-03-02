import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Chip } from './Chip'

describe('Chip', () => {
  it('should render label', () => {
    renderWithProviders(<Chip label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('should render as link when href provided', () => {
    renderWithProviders(<Chip label="React" href="/react" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/react')
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(<Chip label="React" onClick={handleClick} />)

    await user.click(screen.getByText('React'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render remove button when onRemove provided', () => {
    const handleRemove = vi.fn()
    renderWithProviders(<Chip label="React" onRemove={handleRemove} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should call onRemove when remove button clicked', async () => {
    const user = userEvent.setup()
    const handleRemove = vi.fn()

    renderWithProviders(<Chip label="React" onRemove={handleRemove} />)

    await user.click(screen.getByRole('button'))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('should render icon when icon provided', () => {
    const { container } = renderWithProviders(
      <Chip label="React" icon={<span data-testid="custom-icon">★</span>} />
    )
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument()
  })
})
