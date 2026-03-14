'use client'

import { useState, useMemo } from 'react'
import { Modal, Input, SelectList, ListItem, Button, Section } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useUsersSearchQuery, useCreateStaffInvitationMutation } from '../model/hooks'
import type { HackathonRole } from '@/entities/hackathon/api/listHackathonStaff'

export interface StaffInviteModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

const STAFF_ROLES: HackathonRole[] = [
  'HACKATHON_ROLE_ORGANIZER',
  'HACKATHON_ROLE_MENTOR',
  'HACKATHON_ROLE_JURY',
]

export function StaffInviteModal({ open, onClose, hackathonId }: StaffInviteModalProps) {
  const t = useT()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<HackathonRole>('HACKATHON_ROLE_ORGANIZER')
  const [message, setMessage] = useState('')

  const { data: usersData, isLoading: isSearching } = useUsersSearchQuery(searchQuery)
  const createInvitationMutation = useCreateStaffInvitationMutation(hackathonId)

  const users = usersData?.users || []

  const handleInvite = async () => {
    if (!selectedUserId) return

    try {
      await createInvitationMutation.mutateAsync({
        targetUserId: selectedUserId,
        requestedRole: selectedRole,
        message: message || undefined,
      })
      onClose()
      setSearchQuery('')
      setSelectedUserId(null)
      setMessage('')
    } catch (error) {
      // Error is already logged in the mutation
    }
  }

  const getRoleLabel = (role: HackathonRole) => {
    switch (role) {
      case 'HACKATHON_ROLE_ORGANIZER':
        return t('hackathons.management.staff.roles.organizer')
      case 'HACKATHON_ROLE_MENTOR':
        return t('hackathons.management.staff.roles.mentor')
      case 'HACKATHON_ROLE_JURY':
        return t('hackathons.management.staff.roles.jury')
      default:
        return role
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('hackathons.management.staff.invite')}>
      <div className="flex flex-col gap-m6">
        <Section title={t('hackathons.management.staff.searchUser')} variant="outlined">
          <Input
            type="search"
            placeholder={t('hackathons.management.staff.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />

          {searchQuery.length >= 2 && (
            <div className="max-h-[200px] overflow-y-auto mt-m4">
              {isSearching ? (
                <p className="typography-body-sm text-text-secondary">
                  {t('hackathons.list.loading')}
                </p>
              ) : users.length > 0 ? (
                <SelectList>
                  {users.map(user => (
                    <ListItem
                      key={user.userId}
                      text={`${user.firstName || ''} ${user.lastName || ''} (${user.email || user.userId})`}
                      selectable
                      selected={selectedUserId === user.userId}
                      variant="bordered"
                      onClick={() => setSelectedUserId(user.userId)}
                    />
                  ))}
                </SelectList>
              ) : (
                <p className="typography-body-sm text-text-secondary">
                  {t('hackathons.list.empty')}
                </p>
              )}
            </div>
          )}
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
          <Input
            type="text"
            placeholder={t('hackathons.management.staff.messagePlaceholder')}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </Section>

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
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
