'use client'

import { Section, SelectList, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useStaffListQuery, useStaffUsersQuery } from '../model/hooks'
import { useState, useMemo } from 'react'
import { StaffInviteModal } from './StaffInviteModal'
import { UserListItem } from '@/entities/user'
import type { HackathonRole } from '@/entities/hackathon/api/listHackathonStaff'

export interface StaffListProps {
  hackathonId: string
}

export function StaffList({ hackathonId }: StaffListProps) {
  const t = useT()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { data, isLoading } = useStaffListQuery(hackathonId)

  const staff = useMemo(() => data?.staff || [], [data?.staff])
  const userIds = useMemo(() => staff.map(s => s.userId).filter((id): id is string => id != null), [staff])
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

  return (
    <>
      <Section
        title={t('hackathons.management.staff.title')}
        action={
          <Button
            variant="icon-secondary"
            size="xs"
            onClick={() => setIsInviteModalOpen(true)}
            aria-label={t('hackathons.management.staff.invite')}
          >
            <Icon src="/icons/icon-plus/icon-plus-xs.svg" size="xs" color="secondary" />
          </Button>
        }
      >
        {isLoading ? (
          <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
        ) : staff.length > 0 ? (
          <SelectList>
            {staff.map(member => (
              <UserListItem
                key={member.userId}
                userId={member.userId}
                user={usersMap.get(member.userId ?? '')}
                caption={(member.roles ?? []).map(getRoleLabel).join(', ')}
                variant="bordered"
              />
            ))}
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
    </>
  )
}
