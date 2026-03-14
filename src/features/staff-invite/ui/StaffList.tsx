'use client'

import { Section, ListItem, SelectList, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useStaffListQuery, useStaffUsersQuery } from '../model/hooks'
import { useState, useMemo } from 'react'
import { StaffInviteModal } from './StaffInviteModal'
import type { HackathonRole } from '@/entities/hackathon/api/listHackathonStaff'

export interface StaffListProps {
  hackathonId: string
}

export function StaffList({ hackathonId }: StaffListProps) {
  const t = useT()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { data, isLoading } = useStaffListQuery(hackathonId)

  const staff = useMemo(() => data?.staff || [], [data?.staff])
  const userIds = useMemo(() => staff.map(s => s.userId), [staff])
  const { data: usersData, isLoading: isLoadingUsers } = useStaffUsersQuery(userIds)
  
  const usersMap = useMemo(() => {
    if (!usersData?.users) return new Map()
    return new Map(usersData.users.map(u => [u.userId, u]))
  }, [usersData])

  const getRoleLabel = (role: HackathonRole) => {
    switch (role) {
      case 'HACKATHON_ROLE_OWNER':
      case 'HX_ROLE_OWNER':
        return t('hackathons.management.staff.roles.owner')
      case 'HACKATHON_ROLE_ORGANIZER':
      case 'HX_ROLE_ORGANIZER':
        return t('hackathons.management.staff.roles.organizer')
      case 'HACKATHON_ROLE_MENTOR':
      case 'HX_ROLE_MENTOR':
        return t('hackathons.management.staff.roles.mentor')
      case 'HACKATHON_ROLE_JURY':
      case 'HX_ROLE_JUDGE':
      case 'HX_ROLE_JURY':
        return t('hackathons.management.staff.roles.jury')
      default:
        return role
    }
  }

  const getUserDisplayName = (userId: string) => {
    const user = usersMap.get(userId)
    if (!user) return userId
    
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
    const username = user.email?.split('@')[0] || userId
    
    return name ? `${name} / ${username}` : username
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
              <ListItem
                key={member.userId}
                text={getUserDisplayName(member.userId)}
                caption={member.roles.map(getRoleLabel).join(', ')}
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
