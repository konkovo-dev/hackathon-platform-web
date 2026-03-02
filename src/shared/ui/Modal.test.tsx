import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Modal } from './Modal'

describe('Modal', () => {
  it('should not render when closed', () => {
    renderWithProviders(
      <Modal open={false} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should call onClose when clicking backdrop', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    renderWithProviders(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    )

    const backdrop = screen.getByRole('dialog').querySelector('.absolute.inset-0')
    if (backdrop) {
      await user.click(backdrop)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should call onClose when clicking close button', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    renderWithProviders(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    )

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when pressing Escape', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    renderWithProviders(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should have aria-modal attribute', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('should merge custom className', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal" className="custom-class">
        Content
      </Modal>
    )
    const modalContent = screen.getByRole('dialog').querySelector('.relative.z-10')
    expect(modalContent).toHaveClass('custom-class')
  })

  it('should render complex children', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </Modal>
    )
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
  })
})
