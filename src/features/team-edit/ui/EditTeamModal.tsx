'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorAlert, Modal, Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useUpdateTeamMutation, useDeleteTeamMutation } from '../model/hooks'
import type { Team } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'
import { TeamFormFields } from './TeamFormFields'

export interface EditTeamModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  team: Team
}

export function EditTeamModal({ open, onClose, hackathonId, team }: EditTeamModalProps) {
  const t = useT()
  const router = useRouter()
  const [name, setName] = useState(team.name || '')
  const [description, setDescription] = useState(team.description || '')
  const [isJoinable, setIsJoinable] = useState(team.isJoinable ?? true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMutation = useUpdateTeamMutation(hackathonId, team.teamId!)
  const deleteMutation = useDeleteTeamMutation(hackathonId, team.teamId!)

  const handleUpdate = async () => {
    if (!name.trim()) return

    try {
      setError(null)
      await updateMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        isJoinable,
      })
      onClose()
    } catch (err) {
      console.error('Failed to update team:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.updateFailed'))
      } else {
        setError(t('teams.errors.updateFailed'))
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
      router.push(routes.hackathons.teams.list(hackathonId))
    } catch (err) {
      console.error('Failed to delete team:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.deleteFailed'))
      } else {
        setError(t('teams.errors.deleteFailed'))
      }
    }
  }

  return (
    <>
      <Modal open={open && !confirmDelete} onClose={onClose} title={t('teams.edit.title')} size="lg">
        <div className="flex flex-col gap-m6">
          <TeamFormFields
            name={name}
            onNameChange={setName}
            description={description}
            onDescriptionChange={setDescription}
            isJoinable={isJoinable}
            onIsJoinableChange={setIsJoinable}
            descriptionRows={4}
          />

          {error && <ErrorAlert message={error} />}

          <div className="flex gap-m4 justify-between">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmDelete(true)}
              disabled={updateMutation.isPending}
            >
              {t('teams.edit.delete')}
            </Button>
            <div className="flex gap-m4">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                disabled={updateMutation.isPending}
              >
                {t('teams.create.cancel')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleUpdate}
                disabled={!name.trim() || updateMutation.isPending}
              >
                {updateMutation.isPending ? t('teams.list.loading') : t('teams.edit.submit')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={t('teams.edit.delete')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">{t('teams.edit.deleteConfirm')}</p>

          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmDelete(false)}
              disabled={deleteMutation.isPending}
            >
              {t('teams.create.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('teams.list.loading') : t('teams.edit.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
