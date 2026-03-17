'use client'

import { useState } from 'react'
import { ErrorAlert, Modal, Input, SelectList, ListItem, Button, Section, MarkdownEditor } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useUsersSearchQuery, useCreateStaffInvitationMutation } from '../model/hooks'
import type { HackathonRole } from '@/entities/hackathon/api/listHackathonStaff'
import { ApiError } from '@/shared/api/errors'

export interface StaffInviteModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

const STAFF_ROLES: HackathonRole[] = [
  'HX_ROLE_ORGANIZER',
  'HX_ROLE_MENTOR',
  'HX_ROLE_JUDGE',
]

export function StaffInviteModal({ open, onClose, hackathonId }: StaffInviteModalProps) {
  const t = useT()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<HackathonRole>('HX_ROLE_ORGANIZER')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: usersData, isLoading: isSearching } = useUsersSearchQuery(searchQuery)
  const createInvitationMutation = useCreateStaffInvitationMutation(hackathonId)

  const users = usersData?.users || []
  
  const getErrorMessage = (error: unknown): string => {
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

  const handleInvite = async () => {
    if (!selectedUserId) return

    try {
      setError(null)
      await createInvitationMutation.mutateAsync({
        targetUserId: selectedUserId,
        requestedRole: selectedRole,
        message: message || undefined,
      })
      onClose()
      setSearchQuery('')
      setSelectedUserId(null)
      setMessage('')
      setError(null)
    } catch (err) {
      console.error('Failed to create staff invitation:', err)
      setError(getErrorMessage(err))
    }
  }
  
  const handleClose = () => {
    onClose()
    setError(null)
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
    <Modal open={open} onClose={handleClose} title={t('hackathons.management.staff.invite')} size="lg">
      <div className="flex flex-col gap-m6">
        <Section title={t('hackathons.management.staff.searchUser')} variant="outlined">
          <Input
            variant="search"
            placeholder={t('hackathons.management.staff.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            autoFocus
          />

          <div className="h-[244px] mt-m4">
            {searchQuery.length < 2 ? (
              <div className="flex items-center justify-center h-full">
                <p className="typography-body-sm text-text-secondary">
                  {t('hackathons.management.staff.searchPlaceholder')}
                </p>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center h-full">
                <p className="typography-body-sm text-text-secondary">
                  {t('hackathons.list.loading')}
                </p>
              </div>
            ) : users.length > 0 ? (
              <div className="h-full overflow-y-auto">
                <SelectList>
                  {users.map(user => {
                    if (!user.userId) return null
                    
                    const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
                    const displayText = name 
                      ? `${name} (${user.username || user.userId})` 
                      : (user.username || user.userId)
                    
                    return (
                      <ListItem
                        key={user.userId}
                        text={displayText}
                        selectable
                        selected={selectedUserId === user.userId}
                        variant="bordered"
                        onClick={() => setSelectedUserId(user.userId!)}
                      />
                    )
                  })}
                </SelectList>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="typography-body-sm text-text-secondary">
                  {t('hackathons.management.staff.noUsersFound')}
                </p>
              </div>
            )}
          </div>
        </Section>

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

        <Section title={t('hackathons.management.staff.message')} variant="outlined">
          <MarkdownEditor
            value={message}
            onChange={setMessage}
            placeholder={t('hackathons.management.staff.messagePlaceholder')}
            rows={4}
          />
        </Section>

        {error && <ErrorAlert message={error} />}

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={createInvitationMutation.isPending}
          >
            {t('hackathons.create.actions.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleInvite}
            disabled={!selectedUserId || createInvitationMutation.isPending}
          >
            {createInvitationMutation.isPending
              ? t('hackathons.list.loading')
              : t('hackathons.management.staff.invite')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
