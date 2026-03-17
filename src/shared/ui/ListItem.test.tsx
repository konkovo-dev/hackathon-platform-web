import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { ListItem } from './ListItem'

describe('ListItem', () => {
  describe('базовая функциональность', () => {
    it('должен отображать текст', () => {
      renderWithProviders(<ListItem text="Test item" />)
      expect(screen.getByText('Test item')).toBeInTheDocument()
    })

    it('должен отображать caption', () => {
      renderWithProviders(<ListItem text="Test item" caption="5 минут назад" />)
      expect(screen.getByText('5 минут назад')).toBeInTheDocument()
    })

    it('должен вызывать onClick при клике', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      renderWithProviders(<ListItem text="Test item" onClick={handleClick} />)
      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('selectable режим', () => {
    it('должен иметь role="option" в selectable режиме', () => {
      renderWithProviders(<ListItem text="Test item" selectable />)
      expect(screen.getByRole('option')).toBeInTheDocument()
    })

    it('должен отображать checkbox в selectable режиме', () => {
      renderWithProviders(<ListItem text="Test item" selectable />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('должен быть выбран когда selected=true', () => {
      renderWithProviders(<ListItem text="Test item" selectable selected />)
      const option = screen.getByRole('option')
      expect(option).toHaveAttribute('aria-selected', 'true')
    })

    it('не должен иметь aria-selected когда не выбран', () => {
      renderWithProviders(<ListItem text="Test item" selectable />)
      const option = screen.getByRole('option')
      expect(option.getAttribute('aria-selected')).toBeNull()
    })
  })

  describe('варианты оформления', () => {
    it('должен применять стили default варианта по умолчанию', () => {
      const { container } = renderWithProviders(<ListItem text="Test item" />)
      const root = container.firstElementChild
      expect(root).toHaveClass('border-b')
    })

    it('должен применять стили bordered варианта', () => {
      renderWithProviders(<ListItem text="Test item" variant="bordered" onClick={() => {}} />)
      const item = screen.getByRole('button')
      expect(item).toHaveClass('border')
      expect(item).toHaveClass('rounded-[var(--spacing-m2)]')
    })

    it('должен применять стили section варианта', () => {
      renderWithProviders(<ListItem text="Test item" variant="section" onClick={() => {}} />)
      const item = screen.getByRole('button')
      expect(item).toHaveClass('bg-bg-elevated')
      expect(item).toHaveClass('rounded-[var(--spacing-m4)]')
    })

    it('должен применять стили danger для bordered варианта', () => {
      renderWithProviders(
        <ListItem text="Test item" variant="bordered" danger onClick={() => {}} />
      )
      const item = screen.getByRole('button')
      expect(item).toHaveClass('border-state-error')
      expect(item).toHaveClass('hover:bg-state-error/5')
    })
  })

  describe('rightContent', () => {
    it('должен отображать rightContent вместо caption', () => {
      renderWithProviders(
        <ListItem
          text="Test item"
          caption="caption"
          rightContent={<span>Custom content</span>}
        />
      )
      expect(screen.getByText('Custom content')).toBeInTheDocument()
      expect(screen.queryByText('caption')).not.toBeInTheDocument()
    })
  })
})
