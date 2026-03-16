'use client'

import { useState } from 'react'
import { Tabs, SelectList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import {
  useStaffInvitationsQuery,
  useTeamInvitationsQuery,
  useAcceptStaffInvitation,
  useRejectStaffInvitation,
  useAcceptTeamInvitation,
  useRejectTeamInvitation,
} from '../model/hooks'
import { StaffInvitationItem } from './StaffInvitationItem'
import { TeamInvitationItem } from './TeamInvitationItem'

export function InvitationsList() {
  const t = useT()
  const [activeTab, setActiveTab] = useState<'staff' | 'team'>('staff')

  const staffQuery = useStaffInvitationsQuery()
  const teamQuery = useTeamInvitationsQuery()

  const acceptStaffMutation = useAcceptStaffInvitation()
  const rejectStaffMutation = useRejectStaffInvitation()
  const acceptTeamMutation = useAcceptTeamInvitation()
  const rejectTeamMutation = useRejectTeamInvitation()

  const pendingStaffInvitations =
    staffQuery.data?.invitations?.filter(inv => inv.status === 'STAFF_INVITATION_PENDING') ?? []
  const pendingTeamInvitations =
    teamQuery.data?.invitations?.filter(inv => inv.status === 'TEAM_INBOX_PENDING') ?? []

  const tabs = [
    { id: 'staff', label: t('invitations.tabs.staff') },
    { id: 'team', label: t('invitations.tabs.team') },
  ]

  const isLoading = staffQuery.isLoading || teamQuery.isLoading

  return (
    <div className="flex flex-col gap-m8">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={id => setActiveTab(id as 'staff' | 'team')} />

      {isLoading ? (
        <p className="typography-body-sm text-text-secondary">{t('invitations.loading')}</p>
      ) : activeTab === 'staff' ? (
        pendingStaffInvitations.length > 0 ? (
          <SelectList>
            {pendingStaffInvitations.map(invitation => (
              <StaffInvitationItem
                key={invitation.invitationId}
                invitation={invitation}
                onAccept={() => acceptStaffMutation.mutate(invitation.invitationId!)}
                onReject={() => rejectStaffMutation.mutate(invitation.invitationId!)}
                isAccepting={acceptStaffMutation.isPending}
                isRejecting={rejectStaffMutation.isPending}
              />
            ))}
          </SelectList>
        ) : (
          <p className="typography-body-sm text-text-secondary">{t('invitations.empty.staff')}</p>
        )
      ) : pendingTeamInvitations.length > 0 ? (
        <SelectList>
          {pendingTeamInvitations.map(invitation => (
            <TeamInvitationItem
              key={invitation.invitationId}
              invitation={invitation}
              onAccept={() => acceptTeamMutation.mutate(invitation.invitationId!)}
              onReject={() => rejectTeamMutation.mutate(invitation.invitationId!)}
              isAccepting={acceptTeamMutation.isPending}
              isRejecting={rejectTeamMutation.isPending}
            />
          ))}
        </SelectList>
      ) : (
        <p className="typography-body-sm text-text-secondary">{t('invitations.empty.team')}</p>
      )}
    </div>
  )
}
