'use client'

import { useState } from 'react'
import {
  InviteUserModal,
  Section,
  SelectList,
  ListItem,
  MarkdownEditor,
} from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateStaffInvitationMutation } from '../model/hooks'
import type { HackathonRole } from '@/entities/hackathon/api/listHackathonStaff'
import { ApiError } from '@/shared/api/errors'

export interface StaffInviteModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

const STAFF_ROLES: HackathonRole[] = ['HX_ROLE_ORGANIZER', 'HX_ROLE_MENTOR', 'HX_ROLE_JUDGE']

export function StaffInviteModal({ open, onClose, hackathonId }: StaffInviteModalProps) {
  const t = useT()
  const [selectedRole, setSelectedRole] = useState<HackathonRole>('HX_ROLE_ORGANIZER')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createInvitationMutation = useCreateStaffInvitationMutation(hackathonId)

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof ApiError) {
      const msg = err.data.message.toLowerCase()
      if (err.data.status === 404 || msg.includes('user not found')) {
        return t('hackathons.management.staff.errors.user_not_found')
      }
      if (msg.includes('already a staff member')) {
        return t('hackathons.management.staff.errors.already_staff')
      }
      if (msg.includes('pending invitation already exists')) {
        return t('hackathons.management.staff.errors.pending_invitation')
      }
      if (msg.includes('cannot invite yourself')) {
        return t('hackathons.management.staff.errors.cannot_invite_self')
      }
      if (msg.includes('invalid role')) {
        return t('hackathons.management.staff.errors.invalid_role')
      }
      if (err.data.status === 401) return t('hackathons.management.staff.errors.unauthorized')
      if (err.data.status === 403) return t('hackathons.management.staff.errors.forbidden')
    }
    return t('hackathons.management.staff.errors.invite_failed')
  }

  const handleInvite = async (selectedUserId: string) => {
    try {
      setError(null)
      await createInvitationMutation.mutateAsync({
        targetUserId: selectedUserId,
        requestedRole: selectedRole,
        message: message || undefined,
      })
      setMessage('')
      onClose()
    } catch (err) {
      console.error('Failed to create staff invitation:', err)
      setError(getErrorMessage(err))
    }
  }

  const getRoleLabel = (role: HackathonRole) => {
    switch (role) {
      case 'HX_ROLE_ORGANIZER':
        return t('hackathons.management.staff.roles.organizer')
      case 'HX_ROLE_MENTOR':
        return t('hackathons.management.staff.roles.mentor')
      case 'HX_ROLE_JUDGE':
        return t('hackathons.management.staff.roles.jury')
      default:
        return role
    }
  }

  return (
    <InviteUserModal
      open={open}
      onClose={() => {
        setError(null)
        onClose()
      }}
      title={t('hackathons.management.staff.invite')}
      submitLabel={t('hackathons.management.staff.invite')}
      cancelLabel={t('hackathons.create.actions.cancel')}
      isPending={createInvitationMutation.isPending}
      searchSectionTitle={t('hackathons.management.staff.searchUser')}
      searchPlaceholder={t('hackathons.management.staff.searchPlaceholder')}
      loadingLabel={t('hackathons.list.loading')}
      error={error}
      onInvite={handleInvite}
      middleSection={
        <Section title={t('hackathons.management.staff.selectRole')} variant="outlined">
          <SelectList>
            {STAFF_ROLES.map(role => (
              <ListItem
                key={role}
                text={getRoleLabel(role)}
                selectable
                selected={selectedRole === role}
                variant="bordered"
                onClick={() => setSelectedRole(role)}
              />
            ))}
          </SelectList>
        </Section>
      }
      messageSection={
        <Section title={t('hackathons.management.staff.message')} variant="outlined">
          <MarkdownEditor
            value={message}
            onChange={setMessage}
            placeholder={t('hackathons.management.staff.messagePlaceholder')}
            rows={4}
          />
        </Section>
      }
    />
  )
}
