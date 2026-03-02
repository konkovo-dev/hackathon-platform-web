import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('should render image when src provided', () => {
    const { container } = renderWithProviders(<Avatar src="/avatar.jpg" name="Test" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/avatar.jpg')
  })

  it('should render fallback initials from name', () => {
    renderWithProviders(<Avatar name="Alex Brown" />)
    expect(document.body.textContent).toContain('A')
  })

  it('should render question mark when no name or src', () => {
    renderWithProviders(<Avatar />)
    expect(document.body.textContent).toContain('?')
  })

  it('should render with different sizes', () => {
    const { container: smallContainer } = renderWithProviders(<Avatar name="A" size="sm" />)
    expect(smallContainer.firstChild).toHaveClass('h-m12', 'w-m12')

    const { container: mdContainer } = renderWithProviders(<Avatar name="A" size="md" />)
    expect(mdContainer.firstChild).toHaveClass('h-m16', 'w-m16')

    const { container: lgContainer } = renderWithProviders(<Avatar name="A" size="lg" />)
    expect(lgContainer.firstChild).toHaveClass('h-[48px]', 'w-[48px]')
  })
})
