import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@tests/setup/test-utils'
import { FormField } from './FormField'
import { Input } from './Input'

describe('FormField', () => {
  it('should render children', () => {
    renderWithProviders(
      <FormField>
        <Input placeholder="Enter text" />
      </FormField>
    )
    expect(screen.getByPlaceholderText('# Enter text')).toBeInTheDocument()
  })

  it('should render label when provided', () => {
    renderWithProviders(
      <FormField label="Username" labelFor="username">
        <Input id="username" />
      </FormField>
    )
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should render error message when provided', () => {
    renderWithProviders(
      <FormField error="This field is required">
        <Input />
      </FormField>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('should not render error when error is not provided', () => {
    renderWithProviders(
      <FormField>
        <Input />
      </FormField>
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should link label to input via labelFor', () => {
    renderWithProviders(
      <FormField label="Email" labelFor="email-input">
        <Input id="email-input" />
      </FormField>
    )
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email-input')
  })
})
