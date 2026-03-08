import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { IconCompletion } from './IconCompletion'

describe('IconCompletion', () => {
  it('renders with progress 0', () => {
    const { container } = render(<IconCompletion progress={0} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-label', 'Progress 0 out of 6')
  })

  it('renders with progress 1', () => {
    const { container } = render(<IconCompletion progress={1} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Progress 1 out of 6')
  })

  it('renders with progress 3 (half)', () => {
    const { container } = render(<IconCompletion progress={3} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Progress 3 out of 6')
  })

  it('renders with progress 6 (complete)', () => {
    const { container } = render(<IconCompletion progress={6} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Progress 6 out of 6')
  })

  it('renders all progress states', () => {
    const progressValues: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> = [0, 1, 2, 3, 4, 5, 6]

    progressValues.forEach(progress => {
      const { container } = render(<IconCompletion progress={progress} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    const { container } = render(<IconCompletion progress={3} className="custom-class" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })
})
