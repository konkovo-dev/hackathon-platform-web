'use client'

import { Section, SelectList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useHackathonStaffInvitationsQuery, useCancelStaffInvitationMutation } from '../model/hooks'
import { SentStaffInvitationItem } from './SentStaffInvitationItem'

export interface SentStaffInvitationsSectionProps {
  hackathonId: string
}

const PENDING_STATUS = 'STAFF_INVITATION_PENDING'

export function SentStaffInvitationsSection({ hackathonId }: SentStaffInvitationsSectionProps) {
  const t = useT()
  const { data, isLoading } = useHackathonStaffInvitationsQuery(hackathonId)
  const cancelMutation = useCancelStaffInvitationMutation(hackathonId)

  const pending = data?.invitations?.filter(inv => inv.status === PENDING_STATUS) ?? []

  if (isLoading || pending.length === 0) {
    return null
  }

  return (
    <Section title={t('hackathons.management.staff.sentInvitations')}>
      <SelectList>
        {pending.map(invitation => (
          <SentStaffInvitationItem
            key={invitation.invitationId}
            invitation={invitation}
            onCancel={() => cancelMutation.mutate(invitation.invitationId!)}
            isCancelling={cancelMutation.isPending}
          />
        ))}
      </SelectList>
    </Section>
  )
}
