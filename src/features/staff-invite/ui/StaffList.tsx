'use client'

import { Section, SelectList, Button, Icon, Modal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { useStaffListQuery, useStaffUsersQuery, useRemoveStaffRoleMutation } from '../model/hooks'
import { useState, useMemo } from 'react'
import { StaffInviteModal } from './StaffInviteModal'
import { UserListItem } from '@/entities/user'
import type {
  HackathonRole,
  HackathonStaffMember,
} from '@/entities/hackathon/api/listHackathonStaff'
import { useCan } from '@/shared/policy/useCan'

export interface StaffListProps {
  hackathonId: string
}

export function StaffList({ hackathonId }: StaffListProps) {
  const t = useT()
  const { data: sessionData } = useSessionQuery()
  const currentUserId = sessionData?.active ? sessionData.userId : undefined
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [memberToExclude, setMemberToExclude] = useState<HackathonStaffMember | null>(null)
  const { data, isLoading } = useStaffListQuery(hackathonId)

  const staff = useMemo(() => data?.staff || [], [data?.staff])
  const canRemoveStaff = useMemo(
    () => staff.some(m => m.userId === currentUserId && (m.roles ?? []).includes('HX_ROLE_OWNER')),
    [staff, currentUserId]
  )
  const { decision: canInviteStaffDecision } = useCan('Participation.InviteStaff', { hackathonId })
  const userIds = useMemo(
    () => staff.map(s => s.userId).filter((id): id is string => id != null),
    [staff]
  )
  const { data: usersData, isLoading: isLoadingUsers } = useStaffUsersQuery(userIds)

  const usersMap = useMemo(() => {
    if (!usersData?.users) return new Map()
    return new Map(usersData.users.map(u => [u.userId, u]))
  }, [usersData])

  const getRoleLabel = (role: HackathonRole) => {
    switch (role) {
      case 'HX_ROLE_OWNER':
        return t('hackathons.management.staff.roles.owner')
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

  const removeRoleMutation = useRemoveStaffRoleMutation(hackathonId)

  const handleOpenExcludeConfirm = (member: HackathonStaffMember) => {
    const rolesToRemove = (member.roles ?? []).filter(
      (r): r is HackathonRole => r != null && r !== 'HACKATHON_ROLE_UNSPECIFIED'
    )
    if (rolesToRemove.length > 0) setMemberToExclude(member)
  }

  const handleConfirmExclude = async () => {
    if (!memberToExclude) return
    const rolesToRemove = (memberToExclude.roles ?? []).filter(
      (r): r is HackathonRole => r != null && r !== 'HACKATHON_ROLE_UNSPECIFIED'
    )
    try {
      for (const role of rolesToRemove) {
        await removeRoleMutation.mutateAsync({
          userId: memberToExclude.userId ?? '',
          role,
        })
      }
      setMemberToExclude(null)
    } catch {
      // Error already logged in mutation
    }
  }

  return (
    <>
      <Section
        title={t('hackathons.management.staff.title')}
        action={
          canInviteStaffDecision.allowed ? (
            <Button
              variant="icon-secondary"
              size="xs"
              onClick={() => setIsInviteModalOpen(true)}
              aria-label={t('hackathons.management.staff.invite')}
            >
              <Icon src="/icons/icon-plus/icon-plus-xs.svg" size="xs" color="secondary" />
            </Button>
          ) : undefined
        }
      >
        {isLoading ? (
          <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
        ) : staff.length > 0 ? (
          <SelectList>
            {staff.map(member => {
              const roleLabel = (member.roles ?? []).map(getRoleLabel).join(', ')
              const rolesToRemove = (member.roles ?? []).filter(
                (r): r is HackathonRole => r != null && r !== 'HACKATHON_ROLE_UNSPECIFIED'
              )
              return (
                <UserListItem
                  key={member.userId}
                  userId={member.userId}
                  user={usersMap.get(member.userId ?? '')}
                  caption={roleLabel}
                  variant="bordered"
                  showNavigationIcon
                  rightActionOnHover={
                    canRemoveStaff && rolesToRemove.length > 0 ? (
                      <Button
                        variant="icon-secondary"
                        size="xs"
                        onClick={e => {
                          e.stopPropagation()
                          handleOpenExcludeConfirm(member)
                        }}
                        aria-label={t('hackathons.management.staff.exclude')}
                        disabled={removeRoleMutation.isPending}
                      >
                        <Icon
                          src="/icons/icon-cross/icon-cross-sm.svg"
                          size="sm"
                          color="secondary"
                        />
                      </Button>
                    ) : undefined
                  }
                />
              )
            })}
          </SelectList>
        ) : (
          <p className="typography-body-sm text-text-secondary">
            {t('hackathons.management.staff.empty')}
          </p>
        )}
      </Section>

      <StaffInviteModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        hackathonId={hackathonId}
      />

      <Modal
        open={!!memberToExclude}
        onClose={() => setMemberToExclude(null)}
        title={t('hackathons.management.staff.exclude')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">
            {t('hackathons.management.staff.exclude_confirm')}
          </p>
          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setMemberToExclude(null)}
              disabled={removeRoleMutation.isPending}
            >
              {t('hackathons.create.actions.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmExclude}
              disabled={removeRoleMutation.isPending}
            >
              {removeRoleMutation.isPending
                ? t('hackathons.list.loading')
                : t('hackathons.management.staff.exclude')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
