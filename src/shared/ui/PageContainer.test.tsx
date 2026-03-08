import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageContainer } from './PageContainer'

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <div>Test content</div>
      </PageContainer>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('container', 'mx-auto', 'max-w-[1080px]', 'py-m32')
  })

  it('merges custom className with default classes', () => {
    const { container } = render(
      <PageContainer className="custom-class">
        <div>Content</div>
      </PageContainer>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('container', 'mx-auto', 'max-w-[1080px]', 'py-m32', 'custom-class')
  })

  it('allows overriding padding via className', () => {
    const { container } = render(
      <PageContainer className="p-0">
        <div>Content</div>
      </PageContainer>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('p-0')
  })
})
