import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IconText } from './IconText'

describe('IconText', () => {
  it('renders icon and text', () => {
    render(<IconText icon={<span data-testid="test-icon">🔥</span>} text="Test text" />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('Test text')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <IconText icon={<span>Icon</span>} text="Text" className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
