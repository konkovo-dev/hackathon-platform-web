import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MarkdownEditor } from './MarkdownEditor'

describe('MarkdownEditor', () => {
  const mockOnChange = vi.fn()

  it('renders editor and preview sections', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />)
    
    expect(screen.getByText('common.markdown.editor')).toBeInTheDocument()
    expect(screen.getByText('common.markdown.preview')).toBeInTheDocument()
  })

  it('displays placeholder when value is empty', () => {
    render(
      <MarkdownEditor 
        value="" 
        onChange={mockOnChange} 
        placeholder="Введите описание"
      />
    )
    
    expect(screen.getByText('Введите описание')).toBeInTheDocument()
  })

  it('calls onChange when text is entered', async () => {
    const user = userEvent.setup()
    render(<MarkdownEditor value="" onChange={mockOnChange} />)
    
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Test markdown')
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('displays markdown in preview', () => {
    const { container } = render(
      <MarkdownEditor value="# Test Heading" onChange={mockOnChange} />
    )
    
    const h1 = container.querySelector('h1')
    expect(h1).toBeInTheDocument()
    expect(h1).toHaveTextContent('Test Heading')
  })

  it('updates preview when value changes', () => {
    const { container, rerender } = render(
      <MarkdownEditor value="Initial text" onChange={mockOnChange} />
    )
    
    expect(container.querySelector('p')).toHaveTextContent('Initial text')
    
    rerender(<MarkdownEditor value="**Bold text**" onChange={mockOnChange} />)
    
    expect(container.querySelector('strong')).toHaveTextContent('Bold text')
  })

  it('disables textarea when disabled prop is true', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} disabled />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('applies error styling when error prop is true', () => {
    const { container } = render(
      <MarkdownEditor value="" onChange={mockOnChange} error />
    )
    
    const textareaWrapper = container.querySelector('[class*="border-state-error"]')
    expect(textareaWrapper).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <MarkdownEditor value="" onChange={mockOnChange} className="custom-class" />
    )
    
    const wrapper = container.querySelector('.grid')
    expect(wrapper).toHaveClass('custom-class')
  })

  it('renders complex markdown in preview', () => {
    const markdown = `
# Heading
## Subheading

This is **bold** and *italic* text.

- List item 1
- List item 2

[Link](https://example.com)

\`inline code\`
`
    const { container } = render(
      <MarkdownEditor value={markdown} onChange={mockOnChange} />
    )
    
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('strong')).toBeInTheDocument()
    expect(container.querySelector('em')).toBeInTheDocument()
    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelector('a')).toBeInTheDocument()
    expect(container.querySelector('code')).toBeInTheDocument()
  })

  it('respects rows prop for textarea', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} rows={10} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '10')
  })

  it('uses default placeholder when none is provided', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />)
    
    expect(screen.getByText('common.markdown.placeholder')).toBeInTheDocument()
  })

  it('shows custom placeholder in both editor and empty preview', () => {
    const customPlaceholder = 'Опишите ваш хакатон'
    render(
      <MarkdownEditor 
        value="" 
        onChange={mockOnChange} 
        placeholder={customPlaceholder}
      />
    )
    
    expect(screen.getAllByText(customPlaceholder).length).toBeGreaterThan(0)
  })
})
