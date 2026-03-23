'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ErrorAlert, Modal, Button, Tabs } from '@/shared/ui'
import { ParticipationProfileFields } from './ParticipationProfileFields'
import { TeamFormFields } from '@/features/team-edit'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { useRegisterForHackathonMutation } from '../model/hooks'
import { useCreateTeamMutation } from '@/features/team-create/model/hooks'
import { listTeamRoles } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'
import { getHackathonRegistrationErrorI18nKey } from '@/shared/lib/api/hackathonRegistrationErrorKey'

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

  const allowIndividual = hackathon.registrationPolicy?.allowIndividual ?? true
  const allowTeam = hackathon.registrationPolicy?.allowTeam ?? true

  const registerMutation = useRegisterForHackathonMutation(hackathonId)
  const createMutation = useCreateTeamMutation(hackathonId)
  const { data: teamRolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled: open && allowTeam,
  })
  const teamRoles = useMemo(() => teamRolesData?.teamRoles ?? [], [teamRolesData?.teamRoles])
  const teamRoleOptions = useMemo(
    () => teamRoles.filter((r): r is { id: string; name: string } => Boolean(r.id && r.name)),
    [teamRoles]
  )

  if (!allowIndividual && !allowTeam) return null

  const tabs = [
    ...(allowIndividual
      ? [{ id: 'individual' as const, label: t('hackathons.detail.registerIndividual') }]
      : []),
    ...(allowTeam
      ? [{ id: 'createTeam' as const, label: t('hackathons.detail.registerCreateTeam') }]
      : []),
    ...(allowTeam
      ? [{ id: 'findTeam' as const, label: t('hackathons.detail.registerFindTeam') }]
      : []),
  ]

  const defaultTab = tabs[0]?.id ?? 'individual'
  const currentTab = tabs.some(tab => tab.id === activeTab) ? activeTab : defaultTab

  const isPending = registerMutation.isPending || createMutation.isPending

  const goToMyParticipationTab = () => {
    router.replace(routes.hackathons.detailWithTab(hackathonId, 'participation'))
  }

  const handleIndividual = async () => {
    try {
      setError(null)
      await registerMutation.mutateAsync({
        desiredStatus: 'PART_INDIVIDUAL',
        motivationText: individualMotivation.trim() || undefined,
      })
      setIndividualMotivation('')
      onClose()
      goToMyParticipationTab()
    } catch (e) {
      if (e instanceof ApiError) {
        setError(t(getHackathonRegistrationErrorI18nKey(e.data)))
      } else {
        setError(t('hackathons.detail.errors.register_failed'))
      }
    }
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
      goToMyParticipationTab()
    } catch (e) {
      if (e instanceof ApiError) {
        setError(t(getHackathonRegistrationErrorI18nKey(e.data)))
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
        setCreateError(t(getHackathonRegistrationErrorI18nKey(err.data)))
      } else {
        setCreateError(t('hackathons.detail.errors.register_failed'))
      }
      return
    }
    try {
      await createMutation.mutateAsync({
        name: teamName.trim(),
        description: teamDescription.trim() || undefined,
        isJoinable: teamIsJoinable,
      })
      setTeamName('')
      setTeamDescription('')
      setTeamIsJoinable(true)
      onClose()
      goToMyParticipationTab()
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
              <ParticipationProfileFields
                variant="motivationOnly"
                motivationText={individualMotivation}
                onMotivationChange={setIndividualMotivation}
                teamRoles={[]}
                fillHeight
              />
              {error && <ErrorAlert message={error} className="shrink-0" />}
              <div className="flex justify-end shrink-0">
                <Button variant="primary" size="md" onClick={handleIndividual} disabled={isPending}>
                  {registerMutation.isPending
                    ? t('teams.list.loading')
                    : t('hackathons.detail.registerIndividual')}
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
              <ParticipationProfileFields
                variant="motivationAndRoles"
                motivationText={findTeamMotivation}
                onMotivationChange={setFindTeamMotivation}
                teamRoles={teamRoleOptions}
                wishedRoleIds={wishedRoleIds}
                onWishedRoleIdsChange={setWishedRoleIds}
                motivationRows={3}
              />
              {error && <ErrorAlert message={error} className="shrink-0" />}
              <div className="flex justify-end shrink-0">
                <Button variant="primary" size="md" onClick={handleFindTeam} disabled={isPending}>
                  {registerMutation.isPending
                    ? t('teams.list.loading')
                    : t('hackathons.detail.registerFindTeam')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
