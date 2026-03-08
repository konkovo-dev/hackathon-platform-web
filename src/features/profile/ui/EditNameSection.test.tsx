import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { mockUser } from '@tests/fixtures/mockUser'
import { EditNameSection } from './EditNameSection'

describe('EditNameSection', () => {
  const defaultProps = {
    user: mockUser.user!,
    editing: false,
    firstName: 'Иван',
    lastName: 'Иванов',
    onFirstNameChange: vi.fn(),
    onLastNameChange: vi.fn(),
    isPending: false,
  }

  it('should render user name in view mode', () => {
    renderWithProviders(<EditNameSection {...defaultProps} />)

    expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
    expect(screen.getByText(/testuser/)).toBeInTheDocument()
  })

  it('should render input fields in edit mode', () => {
    renderWithProviders(<EditNameSection {...defaultProps} editing={true} />)

    expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Иванов')).toBeInTheDocument()
  })

  it('should call onFirstNameChange when typing in first name', async () => {
    const user = userEvent.setup()
    const handleFirstNameChange = vi.fn()

    renderWithProviders(
      <EditNameSection {...defaultProps} editing={true} onFirstNameChange={handleFirstNameChange} />
    )

    const input = screen.getByDisplayValue('Иван')
    await user.clear(input)
    await user.type(input, 'Пётр')

    expect(handleFirstNameChange).toHaveBeenCalled()
  })

  it('should call onLastNameChange when typing in last name', async () => {
    const user = userEvent.setup()
    const handleLastNameChange = vi.fn()

    renderWithProviders(
      <EditNameSection {...defaultProps} editing={true} onLastNameChange={handleLastNameChange} />
    )

    const input = screen.getByDisplayValue('Иванов')
    await user.clear(input)
    await user.type(input, 'Петров')

    expect(handleLastNameChange).toHaveBeenCalled()
  })

  it('should disable inputs when pending', () => {
    renderWithProviders(<EditNameSection {...defaultProps} editing={true} isPending={true} />)

    const firstNameInput = screen.getByDisplayValue('Иван')
    const lastNameInput = screen.getByDisplayValue('Иванов')

    expect(firstNameInput).toBeDisabled()
    expect(lastNameInput).toBeDisabled()
  })

  it('should not show inputs in view mode', () => {
    renderWithProviders(<EditNameSection {...defaultProps} editing={false} />)

    expect(screen.queryByDisplayValue('Иван')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('Иванов')).not.toBeInTheDocument()
  })
})
