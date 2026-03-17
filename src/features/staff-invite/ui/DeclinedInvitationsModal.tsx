'use client'

import { Modal, SelectList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useHackathonStaffInvitationsQuery, useCancelStaffInvitationMutation } from '../model/hooks'
import { SentStaffInvitationItem } from './SentStaffInvitationItem'

export interface DeclinedInvitationsModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

const DECLINED_STATUS = 'STAFF_INVITATION_DECLINED'

export function DeclinedInvitationsModal({
  open,
  onClose,
  hackathonId,
}: DeclinedInvitationsModalProps) {
  const t = useT()
  const { data, isLoading } = useHackathonStaffInvitationsQuery(hackathonId, open)
  const cancelMutation = useCancelStaffInvitationMutation(hackathonId)

  const declined = data?.invitations?.filter(inv => inv.status === DECLINED_STATUS) ?? []

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('hackathons.management.staff.declinedInvitations')}
      size="md"
    >
      {isLoading ? (
        <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
      ) : declined.length === 0 ? (
        <p className="typography-body-sm text-text-secondary">
          {t('invitations.empty.staff')}
        </p>
      ) : (
        <SelectList>
          {declined.map(invitation => (
            <SentStaffInvitationItem
              key={invitation.invitationId}
              invitation={invitation}
              onCancel={() => cancelMutation.mutate(invitation.invitationId!)}
              isCancelling={cancelMutation.isPending}
            />
          ))}
        </SelectList>
      )}
    </Modal>
  )
}
