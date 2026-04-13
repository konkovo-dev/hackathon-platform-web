'use client'

import { useMemo, useState } from 'react'
import { Divider, Input, SelectList, ListItem, ChipList, Chip, TextareaLabel } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'

export type TeamRoleOption = { id: string; name: string }

export interface ParticipationProfileFieldsProps {
  variant: 'motivationOnly' | 'motivationAndRoles'
  motivationText: string
  onMotivationChange: (value: string) => void
  teamRoles: TeamRoleOption[]
  wishedRoleIds?: string[]
  onWishedRoleIdsChange?: (ids: string[]) => void
  disabled?: boolean
  fillHeight?: boolean
  motivationRows?: number
}

export function ParticipationProfileFields({
  variant,
  motivationText,
  onMotivationChange,
  teamRoles,
  wishedRoleIds = [],
  onWishedRoleIdsChange,
  disabled,
  fillHeight,
  motivationRows,
}: ParticipationProfileFieldsProps) {
  const t = useT()
  const [wishedRolesSearch, setWishedRolesSearch] = useState('')

  const toggleWishedRole = (roleId: string) => {
    if (!onWishedRoleIdsChange || disabled) return
    const next = wishedRoleIds.includes(roleId)
      ? wishedRoleIds.filter(id => id !== roleId)
      : [...wishedRoleIds, roleId]
    onWishedRoleIdsChange(next)
  }

  const filteredTeamRoles = useMemo(() => {
    const roles = teamRoles.filter((r): r is TeamRoleOption => Boolean(r.id && r.name))
    const q = wishedRolesSearch.toLowerCase().trim()
    if (!q) return roles
    return roles.filter(r => r.name.toLowerCase().includes(q))
  }, [teamRoles, wishedRolesSearch])

  return (
    <div className="flex flex-col gap-m6 flex-1 min-h-0">
      <TextareaLabel
        fillHeight={fillHeight}
        label={t('hackathons.detail.registrationForm.motivationLabel')}
        textareaPlaceholder={t('hackathons.detail.registrationForm.motivationPlaceholder')}
        textareaProps={{
          value: motivationText,
          onChange: e => onMotivationChange(e.target.value),
          disabled,
          rows: motivationRows,
        }}
      />
      {variant === 'motivationAndRoles' &&
        teamRoles.length > 0 &&
        onWishedRoleIdsChange != null && (
          <div className="flex flex-col gap-m6 flex-1 min-h-0">
            <span className="typography-label-md text-text-primary shrink-0">
              {t('hackathons.detail.registrationForm.wishedRolesLabel')}
            </span>
            {wishedRoleIds.length > 0 && (
              <ChipList className="shrink-0">
                {wishedRoleIds.map(roleId => {
                  const role = teamRoles.find(r => r.id === roleId)
                  return (
                    role?.name != null && (
                      <Chip
                        key={roleId}
                        label={role.name}
                        variant="primary"
                        onRemove={disabled ? undefined : () => toggleWishedRole(roleId)}
                      />
                    )
                  )
                })}
              </ChipList>
            )}
            <Divider />
            <Input
              variant="search"
              value={wishedRolesSearch}
              onChange={e => setWishedRolesSearch(e.target.value)}
              placeholder={t('hackathons.detail.registrationForm.wishedRolesSearchPlaceholder')}
              disabled={disabled}
            />
            <div className="flex-1 overflow-y-auto min-h-0 -mx-m8 px-m8">
              {filteredTeamRoles.length > 0 ? (
                <SelectList>
                  {filteredTeamRoles.map(role => {
                    const isSelected = wishedRoleIds.includes(role.id)
                    return (
                      <ListItem
                        key={role.id}
                        text={role.name}
                        selectable
                        selected={isSelected}
                        variant="bordered"
                        onClick={() => toggleWishedRole(role.id)}
                      />
                    )
                  })}
                </SelectList>
              ) : (
                <div className="min-h-[80px]" />
              )}
            </div>
          </div>
        )}
    </div>
  )
}
