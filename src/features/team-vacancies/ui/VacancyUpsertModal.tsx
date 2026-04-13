'use client'

import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ErrorAlert,
  Modal,
  InputLabel,
  TextareaLabel,
  Button,
  Chip,
  ChipList,
  Icon,
} from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useUpsertVacancyMutation } from '../model/hooks'
import { useSkillCatalogQuery } from '@/entities/skill/model/hooks'
import { listTeamRoles } from '@/entities/team'
import type { Vacancy } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'
import { AddOptionModal } from './AddOptionModal'

export interface VacancyUpsertModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  teamId: string
  vacancy?: Vacancy
}

export function VacancyUpsertModal({
  open,
  onClose,
  hackathonId,
  teamId,
  vacancy,
}: VacancyUpsertModalProps) {
  const t = useT()
  const [description, setDescription] = useState(vacancy?.description || '')
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    () => vacancy?.desiredRoleIds ?? []
  )
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    () => vacancy?.desiredSkillIds ?? []
  )
  const [slotsTotal, setSlotsTotal] = useState(vacancy?.slotsTotal || '1')
  const [error, setError] = useState<string | null>(null)
  const [addRolesOpen, setAddRolesOpen] = useState(false)
  const [addSkillsOpen, setAddSkillsOpen] = useState(false)

  const upsertMutation = useUpsertVacancyMutation(hackathonId, teamId)
  const { data: catalogData } = useSkillCatalogQuery()
  const { data: rolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled: open,
  })

  const catalogRoles = useMemo(
    () =>
      rolesData?.teamRoles?.filter((r): r is { id: string; name: string } =>
        Boolean(r?.id && r?.name)
      ) ?? [],
    [rolesData]
  )

  const rolesById = useMemo(() => new Map(catalogRoles.map(r => [r.id, r])), [catalogRoles])

  const catalogSkills = useMemo(
    () =>
      catalogData?.skills?.filter((s): s is { id: string; name: string } =>
        Boolean(s?.id && s?.name)
      ) ?? [],
    [catalogData]
  )

  const catalogById = useMemo(() => new Map(catalogSkills.map(s => [s.id, s])), [catalogSkills])

  useEffect(() => {
    if (open) {
      setSelectedRoleIds(vacancy?.desiredRoleIds ?? [])
      setSelectedSkillIds(vacancy?.desiredSkillIds ?? [])
    }
  }, [open, vacancy?.desiredRoleIds, vacancy?.desiredSkillIds])

  const removeRole = (id: string) => {
    setSelectedRoleIds(prev => prev.filter(r => r !== id))
  }

  const removeSkill = (id: string) => {
    setSelectedSkillIds(prev => prev.filter(s => s !== id))
  }

  const handleAddRoles = (ids: string[]) => {
    setSelectedRoleIds(prev => [...new Set([...prev, ...ids])])
  }

  const handleAddSkills = (ids: string[]) => {
    setSelectedSkillIds(prev => [...new Set([...prev, ...ids])])
  }

  const handleSave = async () => {
    const slots = parseInt(slotsTotal, 10)
    if (isNaN(slots) || slots < 1) {
      setError(t('teams.errors.updateFailed'))
      return
    }

    try {
      setError(null)
      await upsertMutation.mutateAsync({
        vacancyId: vacancy?.vacancyId,
        description: description.trim() || undefined,
        desiredRoleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
        desiredSkillIds: selectedSkillIds.length > 0 ? selectedSkillIds : undefined,
        slotsTotal: String(slots),
      })
      onClose()
      resetForm()
    } catch (err) {
      console.error('Failed to upsert vacancy:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.updateFailed'))
      } else {
        setError(t('teams.errors.updateFailed'))
      }
    }
  }

  const resetForm = () => {
    setDescription('')
    setSelectedRoleIds([])
    setSelectedSkillIds([])
    setSlotsTotal('1')
    setError(null)
  }

  const handleClose = () => {
    onClose()
    setError(null)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={vacancy ? t('teams.vacancies.edit') : t('teams.vacancies.create')}
        size="md"
      >
        <div className="flex flex-col gap-m6 max-h-[min(85vh,800px)] overflow-y-auto min-h-0">
          <div className="flex flex-col gap-m8">
            <div className="flex flex-col gap-m6">
              <span className="typography-label-md text-text-primary">
                {t('teams.vacancies.desiredRoles')}
              </span>
              <ChipList>
                {selectedRoleIds.map(id => (
                  <Chip
                    key={id}
                    label={rolesById.get(id)?.name ?? id}
                    onRemove={() => removeRole(id)}
                  />
                ))}
                <Chip
                  variant="secondary"
                  icon={
                    <Icon src="/icons/icon-plus/icon-plus-sm.svg" size="sm" color="secondary" />
                  }
                  label={t('teams.vacancies.addOption')}
                  onClick={() => setAddRolesOpen(true)}
                />
              </ChipList>
            </div>

            <div className="flex flex-col gap-m6">
              <span className="typography-label-md text-text-primary">
                {t('teams.vacancies.desiredSkills')}
              </span>
              <ChipList>
                {selectedSkillIds.map(id => (
                  <Chip
                    key={id}
                    label={catalogById.get(id)?.name ?? id}
                    onRemove={() => removeSkill(id)}
                  />
                ))}
                <Chip
                  variant="secondary"
                  icon={
                    <Icon src="/icons/icon-plus/icon-plus-sm.svg" size="sm" color="secondary" />
                  }
                  label={t('teams.vacancies.addOption')}
                  onClick={() => setAddSkillsOpen(true)}
                />
              </ChipList>
            </div>

            <InputLabel
              label={t('teams.vacancies.slotsTotal')}
              inputPlaceholder={t('teams.vacancies.slotsTotal')}
              inputProps={{
                value: slotsTotal,
                onChange: e => setSlotsTotal(e.target.value),
              }}
            />

            <TextareaLabel
              label={t('teams.vacancies.description')}
              textareaPlaceholder={t('teams.vacancies.descriptionPlaceholder')}
              textareaId="vacancy-description"
              textareaProps={{
                value: description,
                onChange: e => setDescription(e.target.value),
                rows: 3,
              }}
            />
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              disabled={upsertMutation.isPending}
            >
              {t('teams.vacancies.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={upsertMutation.isPending}
            >
              {upsertMutation.isPending ? t('teams.list.loading') : t('teams.vacancies.submit')}
            </Button>
          </div>
        </div>
      </Modal>

      <AddOptionModal
        open={addRolesOpen}
        onClose={() => setAddRolesOpen(false)}
        title={t('teams.vacancies.desiredRoles')}
        searchPlaceholder={t('teams.vacancies.rolesSearch')}
        items={catalogRoles}
        excludeIds={selectedRoleIds}
        onConfirm={handleAddRoles}
      />
      <AddOptionModal
        open={addSkillsOpen}
        onClose={() => setAddSkillsOpen(false)}
        title={t('teams.vacancies.desiredSkills')}
        searchPlaceholder={t('teams.vacancies.skillsSearch')}
        items={catalogSkills}
        excludeIds={selectedSkillIds}
        onConfirm={handleAddSkills}
      />
    </>
  )
}
