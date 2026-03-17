'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  Divider,
  ErrorAlert,
  Modal,
  Button,
  Tabs,
  TextareaLabel,
  Input,
  SelectList,
  ListItem,
  ChipList,
  Chip,
} from '@/shared/ui'
import { TeamFormFields } from '@/features/team-edit'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { useRegisterForHackathonMutation } from '../model/hooks'
import { useCreateTeamMutation } from '@/features/team-create/model/hooks'
import { listTeamRoles } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'
import { getRegistrationErrorI18nKey } from '@/shared/lib/api/registrationErrorKey'

export type RegistrationTabId = 'individual' | 'createTeam' | 'findTeam'

export interface RegistrationChoiceModalProps {
  open: boolean
  onClose: () => void
  hackathon: Hackathon
  hackathonId: string
}

export function RegistrationChoiceModal({
  open,
  onClose,
  hackathon,
  hackathonId,
}: RegistrationChoiceModalProps) {
  const t = useT()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<RegistrationTabId>('individual')

  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [teamIsJoinable, setTeamIsJoinable] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)

  const [individualMotivation, setIndividualMotivation] = useState('')
  const [findTeamMotivation, setFindTeamMotivation] = useState('')
  const [wishedRoleIds, setWishedRoleIds] = useState<string[]>([])
  const [wishedRolesSearch, setWishedRolesSearch] = useState('')

  const allowIndividual = hackathon.registrationPolicy?.allowIndividual ?? true
  const allowTeam = hackathon.registrationPolicy?.allowTeam ?? true

  const registerMutation = useRegisterForHackathonMutation(hackathonId)
  const createMutation = useCreateTeamMutation(hackathonId)
  const { data: teamRolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled: open && allowTeam,
  })
  const teamRoles = useMemo(
    () => teamRolesData?.teamRoles ?? [],
    [teamRolesData?.teamRoles]
  )
  const filteredTeamRoles = useMemo(() => {
    const roles = teamRoles.filter((r): r is { id: string; name: string } => Boolean(r.id && r.name))
    const q = wishedRolesSearch.toLowerCase().trim()
    if (!q) return roles
    return roles.filter(r => r.name.toLowerCase().includes(q))
  }, [teamRoles, wishedRolesSearch])

  if (!allowIndividual && !allowTeam) return null

  const tabs = [
    ...(allowIndividual ? [{ id: 'individual' as const, label: t('hackathons.detail.registerIndividual') }] : []),
    ...(allowTeam ? [{ id: 'createTeam' as const, label: t('hackathons.detail.registerCreateTeam') }] : []),
    ...(allowTeam ? [{ id: 'findTeam' as const, label: t('hackathons.detail.registerFindTeam') }] : []),
  ]

  const defaultTab = tabs[0]?.id ?? 'individual'
  const currentTab = tabs.some(tab => tab.id === activeTab) ? activeTab : defaultTab

  const isPending = registerMutation.isPending || createMutation.isPending

  const handleIndividual = async () => {
    try {
      setError(null)
      await registerMutation.mutateAsync({
        desiredStatus: 'PART_INDIVIDUAL',
        motivationText: individualMotivation.trim() || undefined,
      })
      setIndividualMotivation('')
      onClose()
    } catch (e) {
      if (e instanceof ApiError) {
        setError(t(getRegistrationErrorI18nKey(e.data)))
      } else {
        setError(t('hackathons.detail.errors.register_failed'))
      }
    }
  }

  const toggleWishedRole = (roleId: string) => {
    setWishedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    )
  }

  const handleFindTeam = async () => {
    try {
      setError(null)
      await registerMutation.mutateAsync({
        desiredStatus: 'PART_LOOKING_FOR_TEAM',
        motivationText: findTeamMotivation.trim() || undefined,
        wishedRoleIds: wishedRoleIds.length > 0 ? wishedRoleIds : undefined,
      })
      setFindTeamMotivation('')
      setWishedRoleIds([])
      onClose()
    } catch (e) {
      if (e instanceof ApiError) {
        setError(t(getRegistrationErrorI18nKey(e.data)))
      } else {
        setError(t('hackathons.detail.errors.register_failed'))
      }
    }
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return
    setCreateError(null)
    try {
      await registerMutation.mutateAsync({ desiredStatus: 'PART_LOOKING_FOR_TEAM' })
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(t(getRegistrationErrorI18nKey(err.data)))
      } else {
        setCreateError(t('hackathons.detail.errors.register_failed'))
      }
      return
    }
    try {
      const result = await createMutation.mutateAsync({
        name: teamName.trim(),
        description: teamDescription.trim() || undefined,
        isJoinable: teamIsJoinable,
      })
      setTeamName('')
      setTeamDescription('')
      setTeamIsJoinable(true)
      onClose()
      if (result?.teamId) {
        router.push(routes.hackathons.teams.detail(hackathonId, result.teamId))
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.data.message || t('teams.errors.createFailed'))
      } else {
        setCreateError(t('teams.errors.createFailed'))
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('hackathons.detail.register')}
      size="lg"
      className="max-h-[85vh] h-[700px]"
    >
      <div className="flex flex-col gap-m6 min-h-0 flex-1 overflow-hidden">
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onChange={id => {
            setActiveTab(id)
            setError(null)
            setCreateError(null)
            setWishedRolesSearch('')
          }}
        />

        <div
          role="tabpanel"
          id={`tabpanel-${currentTab}`}
          aria-labelledby={`tab-${currentTab}`}
          className="flex flex-col gap-m6 min-h-0 flex-1 overflow-y-auto"
        >
          {currentTab === 'individual' && (
            <div className="flex flex-col gap-m6 flex-1 min-h-0">
              <TextareaLabel
                fillHeight
                label={t('hackathons.detail.registrationForm.motivationLabel')}
                textareaPlaceholder={t('hackathons.detail.registrationForm.motivationPlaceholder')}
                textareaProps={{
                  value: individualMotivation,
                  onChange: e => setIndividualMotivation(e.target.value),
                }}
              />
              {error && <ErrorAlert message={error} className="shrink-0" />}
              <div className="flex justify-end shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleIndividual}
                  disabled={isPending}
                >
                  {registerMutation.isPending ? t('teams.list.loading') : t('hackathons.detail.registerIndividual')}
                </Button>
              </div>
            </div>
          )}

          {currentTab === 'createTeam' && (
            <div className="flex flex-col gap-m6 flex-1 min-h-0">
              <TeamFormFields
                name={teamName}
                onNameChange={setTeamName}
                description={teamDescription}
                onDescriptionChange={setTeamDescription}
                isJoinable={teamIsJoinable}
                onIsJoinableChange={setTeamIsJoinable}
                fillHeight
                nameAutoFocus
              />
              {createError && <ErrorAlert message={createError} className="shrink-0" />}
              <div className="flex justify-end shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCreateTeam}
                  disabled={!teamName.trim() || isPending}
                >
                  {isPending ? t('teams.list.loading') : t('teams.create.submit')}
                </Button>
              </div>
            </div>
          )}

          {currentTab === 'findTeam' && (
            <div className="flex flex-col gap-m8 flex-1 min-h-0">
              <TextareaLabel
                label={t('hackathons.detail.registrationForm.motivationLabel')}
                textareaPlaceholder={t('hackathons.detail.registrationForm.motivationPlaceholder')}
                textareaProps={{
                  value: findTeamMotivation,
                  onChange: e => setFindTeamMotivation(e.target.value),
                  rows: 3,
                }}
              />
              {teamRoles.length > 0 && (
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
                              onRemove={() => toggleWishedRole(roleId)}
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
              {error && <ErrorAlert message={error} className="shrink-0" />}
              <div className="flex justify-end shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFindTeam}
                  disabled={isPending}
                >
                  {registerMutation.isPending ? t('teams.list.loading') : t('hackathons.detail.registerFindTeam')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
