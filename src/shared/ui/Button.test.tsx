import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Button } from './Button'

describe('Button', () => {
  it('should render with default props', () => {
    renderWithProviders(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should render with custom text prop', () => {
    renderWithProviders(<Button text="Custom text" />)
    expect(screen.getByRole('button', { name: /custom text/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(<Button onClick={handleClick}>Click</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled', () => {
    renderWithProviders(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(
      <Button disabled onClick={handleClick}>
        Click
      </Button>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render primary variant', () => {
    renderWithProviders(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-brand-primary')
  })

  it('should render secondary variant', () => {
    renderWithProviders(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent', 'border')
  })

  it('should render action variant with icon', () => {
    renderWithProviders(<Button variant="action">Action</Button>)
    expect(screen.getByText('>')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('should render secondary-action variant with icon', () => {
    renderWithProviders(<Button variant="secondary-action">Secondary Action</Button>)
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('should render icon variant without text', () => {
    renderWithProviders(
      <Button variant="icon">
        <span>X</span>
      </Button>
    )
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('should render with sm size', () => {
    renderWithProviders(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-m16')
  })

  it('should render with md size', () => {
    renderWithProviders(<Button size="md">Medium</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-m20')
  })

  it('should render with lg size', () => {
    renderWithProviders(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-m24')
  })

  it('should render as submit type', () => {
    renderWithProviders(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('should merge custom className', () => {
    renderWithProviders(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('should forward ref', () => {
    const ref = vi.fn()
    renderWithProviders(<Button ref={ref}>Button</Button>)
    expect(ref).toHaveBeenCalled()
  })
})
