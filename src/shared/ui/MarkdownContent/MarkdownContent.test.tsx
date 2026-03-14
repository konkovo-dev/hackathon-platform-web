import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownContent } from './MarkdownContent'

describe('MarkdownContent', () => {
  it('renders plain text', () => {
    render(<MarkdownContent>Simple text</MarkdownContent>)
    expect(screen.getByText('Simple text')).toBeInTheDocument()
  })

  it('renders headings with correct styles', () => {
    const markdown = `# Heading 1\n## Heading 2\n### Heading 3`
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    
    const h1 = container.querySelector('h1')
    const h2 = container.querySelector('h2')
    const h3 = container.querySelector('h3')
    
    expect(h1).toHaveClass('typography-heading-lg')
    expect(h2).toHaveClass('typography-heading-md')
    expect(h3).toHaveClass('typography-heading-sm')
  })

  it('renders paragraphs with correct typography', () => {
    const { container } = render(<MarkdownContent>Test paragraph</MarkdownContent>)
    const paragraph = container.querySelector('p')
    
    expect(paragraph).toHaveClass('typography-body-md-regular')
    expect(paragraph).toHaveClass('text-text-primary')
  })

  it('renders links with correct styles and attributes', () => {
    render(<MarkdownContent>[Test Link](https://example.com)</MarkdownContent>)
    const link = screen.getByRole('link', { name: 'Test Link' })
    
    expect(link).toHaveClass('text-link-default')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders inline code with correct styling', () => {
    const { container } = render(<MarkdownContent>`inline code`</MarkdownContent>)
    const code = container.querySelector('code')
    
    expect(code).toHaveClass('typography-code-sm')
    expect(code).toHaveTextContent('inline code')
  })

  it('renders code blocks with correct styling', () => {
    const markdown = '```js\nconst x = 1;\n```'
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    const pre = container.querySelector('pre')
    
    expect(pre).toHaveClass('bg-bg-surface')
    expect(pre).toHaveClass('border-border-default')
  })

  it('renders unordered lists', () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3'
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    const list = container.querySelector('ul')
    const items = container.querySelectorAll('li')
    
    expect(list).toHaveClass('list-disc')
    expect(items).toHaveLength(3)
  })

  it('renders ordered lists', () => {
    const markdown = '1. First\n2. Second\n3. Third'
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    const list = container.querySelector('ol')
    const items = container.querySelectorAll('li')
    
    expect(list).toHaveClass('list-decimal')
    expect(items).toHaveLength(3)
  })

  it('renders blockquotes with correct styling', () => {
    const markdown = '> This is a quote'
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    const blockquote = container.querySelector('blockquote')
    
    expect(blockquote).toHaveClass('border-l-4')
    expect(blockquote).toHaveClass('border-border-strong')
    expect(blockquote).toHaveClass('italic')
  })

  it('renders bold text', () => {
    const { container } = render(<MarkdownContent>**bold text**</MarkdownContent>)
    const strong = container.querySelector('strong')
    
    expect(strong).toHaveClass('font-semibold')
    expect(strong).toHaveTextContent('bold text')
  })

  it('renders italic text', () => {
    const { container } = render(<MarkdownContent>*italic text*</MarkdownContent>)
    const em = container.querySelector('em')
    
    expect(em).toHaveClass('italic')
    expect(em).toHaveTextContent('italic text')
  })

  it('renders strikethrough text (GFM)', () => {
    const { container } = render(<MarkdownContent>~~strikethrough~~</MarkdownContent>)
    const del = container.querySelector('del')
    
    expect(del).toHaveClass('line-through')
    expect(del).toHaveTextContent('strikethrough')
  })

  it('renders tables with correct structure (GFM)', () => {
    const markdown = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    
    const table = container.querySelector('table')
    const thead = container.querySelector('thead')
    const tbody = container.querySelector('tbody')
    const th = container.querySelectorAll('th')
    const td = container.querySelectorAll('td')
    
    expect(table).toBeInTheDocument()
    expect(thead).toHaveClass('bg-bg-surface')
    expect(tbody).toBeInTheDocument()
    expect(th).toHaveLength(2)
    expect(td).toHaveLength(2)
  })

  it('renders task lists (GFM)', () => {
    const markdown = `
- [x] Completed task
- [ ] Incomplete task
`
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    
    expect(checkboxes).toHaveLength(2)
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[0]).toBeDisabled()
    expect(checkboxes[1]).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<MarkdownContent className="custom-class">Test</MarkdownContent>)
    const wrapper = container.querySelector('.markdown-content')
    
    expect(wrapper).toHaveClass('custom-class')
  })

  it('renders horizontal rule', () => {
    const markdown = 'Above\n\n---\n\nBelow'
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    const hr = container.querySelector('hr')
    
    expect(hr).toHaveClass('border-divider')
  })

  it('handles empty content', () => {
    const { container } = render(<MarkdownContent>{''}</MarkdownContent>)
    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('handles complex nested markdown', () => {
    const markdown = `
# Main Heading

This is a paragraph with **bold** and *italic* text.

## Subheading

- List item with [link](https://example.com)
- Item with \`inline code\`

> A quote with **bold** text
`
    const { container } = render(<MarkdownContent>{markdown}</MarkdownContent>)
    
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('strong')).toBeInTheDocument()
    expect(container.querySelector('em')).toBeInTheDocument()
    expect(container.querySelector('a')).toBeInTheDocument()
    expect(container.querySelector('code')).toBeInTheDocument()
    expect(container.querySelector('blockquote')).toBeInTheDocument()
  })
})
