import { describe, it, expect } from 'vitest'
import { ApiError } from '@/shared/api/errors'

/**
 * Функция маппинга ошибок приглашения в команду организаторов.
 * Копия из StaffInviteModal для тестирования логики.
 */
function getErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    const message = error.data.message.toLowerCase()

    if (message.includes('user not found') || error.data.status === 404) {
      return t('hackathons.management.staff.errors.user_not_found')
    }
    if (message.includes('already a staff member')) {
      return t('hackathons.management.staff.errors.already_staff')
    }
    if (message.includes('pending invitation already exists')) {
      return t('hackathons.management.staff.errors.pending_invitation')
    }
    if (message.includes('cannot invite yourself')) {
      return t('hackathons.management.staff.errors.cannot_invite_self')
    }
    if (message.includes('invalid role')) {
      return t('hackathons.management.staff.errors.invalid_role')
    }
    if (error.data.status === 401) {
      return t('hackathons.management.staff.errors.unauthorized')
    }
    if (error.data.status === 403) {
      return t('hackathons.management.staff.errors.forbidden')
    }
  }

  return t('hackathons.management.staff.errors.invite_failed')
}

describe('mapInvitationError', () => {
  const mockT = (key: string) => key

  describe('ApiError handling', () => {
    it('should map 404 status to user_not_found', () => {
      const error = new ApiError({ message: 'Not found', status: 404 })
      expect(getErrorMessage(error, mockT)).toBe(
        'hackathons.management.staff.errors.user_not_found'
      )
    })

    it('should map "user not found" message to user_not_found', () => {
      const error = new ApiError({ message: 'invalid input: user not found', status: 400 })
      expect(getErrorMessage(error, mockT)).toBe(
        'hackathons.management.staff.errors.user_not_found'
      )
    })

    it('should map "already a staff member" to already_staff', () => {
      const error = new ApiError({
        message: 'conflict: user is already a staff member',
        status: 409,
      })
      expect(getErrorMessage(error, mockT)).toBe('hackathons.management.staff.errors.already_staff')
    })

    it('should map "pending invitation" to pending_invitation', () => {
      const error = new ApiError({
        message: 'conflict: pending invitation already exists',
        status: 409,
      })
      expect(getErrorMessage(error, mockT)).toBe(
        'hackathons.management.staff.errors.pending_invitation'
      )
    })

    it('should map "cannot invite yourself" to cannot_invite_self', () => {
      const error = new ApiError({ message: 'invalid input: cannot invite yourself', status: 400 })
      expect(getErrorMessage(error, mockT)).toBe(
        'hackathons.management.staff.errors.cannot_invite_self'
      )
    })

    it('should map "invalid role" to invalid_role', () => {
      const error = new ApiError({ message: 'invalid input: invalid role', status: 400 })
      expect(getErrorMessage(error, mockT)).toBe('hackathons.management.staff.errors.invalid_role')
    })

    it('should map 401 status to unauthorized', () => {
      const error = new ApiError({ message: 'Unauthenticated', status: 401 })
      expect(getErrorMessage(error, mockT)).toBe('hackathons.management.staff.errors.unauthorized')
    })

    it('should map 403 status to forbidden', () => {
      const error = new ApiError({ message: 'Permission denied', status: 403 })
      expect(getErrorMessage(error, mockT)).toBe('hackathons.management.staff.errors.forbidden')
    })
  })

  describe('default error handling', () => {
    it('should return generic error for non-ApiError', () => {
      const error = new Error('Unknown error')
      expect(getErrorMessage(error, mockT)).toBe('hackathons.management.staff.errors.invite_failed')
    })

    it('should return generic error for unknown ApiError', () => {
      const error = new ApiError({ message: 'Some other error', status: 500 })
      expect(getErrorMessage(error, mockT)).toBe('hackathons.management.staff.errors.invite_failed')
    })

    it('should return generic error for non-error values', () => {
      expect(getErrorMessage('string error', mockT)).toBe(
        'hackathons.management.staff.errors.invite_failed'
      )
      expect(getErrorMessage(null, mockT)).toBe('hackathons.management.staff.errors.invite_failed')
      expect(getErrorMessage(undefined, mockT)).toBe(
        'hackathons.management.staff.errors.invite_failed'
      )
    })
  })

  describe('case insensitivity', () => {
    it('should match messages case-insensitively', () => {
      const error = new ApiError({ message: 'User Not Found', status: 400 })
      expect(getErrorMessage(error, mockT)).toBe(
        'hackathons.management.staff.errors.user_not_found'
      )
    })
  })
})
