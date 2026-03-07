import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  it('should render with default classes', () => {
    const { container } = render(<Divider />)
    const divider = container.firstChild as HTMLElement
    
    expect(divider).toBeInTheDocument()
    expect(divider.tagName).toBe('DIV')
    expect(divider).toHaveClass('h-px', 'bg-divider')
  })

  it('should accept additional className', () => {
    const { container } = render(<Divider className="my-custom-class" />)
    const divider = container.firstChild as HTMLElement
    
    expect(divider).toHaveClass('h-px', 'bg-divider', 'my-custom-class')
  })

  it('should merge className with default classes', () => {
    const { container } = render(<Divider className="mt-4 mb-4" />)
    const divider = container.firstChild as HTMLElement
    
    expect(divider).toHaveClass('h-px', 'bg-divider', 'mt-4', 'mb-4')
  })
})
