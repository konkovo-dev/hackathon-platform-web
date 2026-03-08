import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    const { container } = render(<Divider />)
    const divider = container.firstChild as HTMLElement

    expect(divider).toHaveClass('bg-border-default')
    expect(divider).toHaveClass('h-px')
    expect(divider).toHaveClass('w-full')
    expect(divider).toHaveAttribute('role', 'separator')
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders vertical divider', () => {
    const { container } = render(<Divider orientation="vertical" />)
    const divider = container.firstChild as HTMLElement

    expect(divider).toHaveClass('bg-border-default')
    expect(divider).toHaveClass('w-px')
    expect(divider).toHaveClass('h-m8')
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('applies custom className', () => {
    const { container } = render(<Divider className="custom-class" />)
    const divider = container.firstChild as HTMLElement

    expect(divider).toHaveClass('custom-class')
  })
})
