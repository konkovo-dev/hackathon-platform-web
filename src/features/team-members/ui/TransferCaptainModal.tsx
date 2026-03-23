'use client'

import { useState, useMemo } from 'react'
import { Modal, SelectList, ListItem, Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useTransferCaptainMutation } from '../model/hooks'
import type { TeamMember } from '@/entities/team'
import type { MeUser } from '@/entities/user/model/types'

export interface TransferCaptainModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  teamId: string
  members: TeamMember[]
  usersMap: Map<string, MeUser>
  currentUserId: string | null | undefined
}

export function TransferCaptainModal({
  open,
  onClose,
  hackathonId,
  teamId,
  members,
  usersMap,
  currentUserId,
}: TransferCaptainModalProps) {
  const t = useT()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const transferMutation = useTransferCaptainMutation(hackathonId, teamId)

  const nonCaptainMembers = useMemo(
    () => members.filter(m => !m.isCaptain && m.userId !== currentUserId),
    [members, currentUserId]
  )

  const handleTransfer = async () => {
    if (!selectedUserId) return

    try {
      await transferMutation.mutateAsync(selectedUserId)
      onClose()
      setSelectedUserId(null)
    } catch (error) {
      console.error('Failed to transfer captain:', error)
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedUserId(null)
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('teams.members.transferCaptain')} size="lg">
      <div className="flex flex-col gap-m6">
        <p className="typography-body-md text-text-primary">
          {t('teams.members.selectNewCaptain')}
        </p>

        <div className="h-[300px] overflow-y-auto">
          <SelectList>
            {nonCaptainMembers.map(member => {
              if (!member.userId) return null

              const user = usersMap.get(member.userId)
              const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
              const displayText = name
                ? `${name} (${user?.username || member.userId})`
                : user?.username || member.userId

              return (
                <ListItem
                  key={member.userId}
                  text={displayText}
                  selectable
                  selected={selectedUserId === member.userId}
                  variant="bordered"
                  onClick={() => setSelectedUserId(member.userId!)}
                />
              )
            })}
          </SelectList>
        </div>

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={transferMutation.isPending}
          >
            {t('teams.create.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleTransfer}
            disabled={!selectedUserId || transferMutation.isPending}
          >
            {transferMutation.isPending
              ? t('teams.list.loading')
              : t('teams.members.transferCaptain')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
