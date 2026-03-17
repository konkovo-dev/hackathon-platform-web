'use client'

import { useState } from 'react'
import { ErrorAlert, Modal, InputLabel, Section, SwitchField, Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateTeamMutation } from '../model/hooks'
import { ApiError } from '@/shared/api/errors'

export interface CreateTeamModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

export function CreateTeamModal({ open, onClose, hackathonId }: CreateTeamModalProps) {
  const t = useT()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isJoinable, setIsJoinable] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateTeamMutation(hackathonId)

  const handleCreate = async () => {
    if (!name.trim()) return

    try {
      setError(null)
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        isJoinable,
      })
      onClose()
      setName('')
      setDescription('')
      setIsJoinable(true)
      setError(null)
    } catch (err) {
      console.error('Failed to create team:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.createFailed'))
      } else {
        setError(t('teams.errors.createFailed'))
      }
    }
  }

  const handleClose = () => {
    onClose()
    setError(null)
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('teams.create.title')} size="lg">
      <div className="flex flex-col gap-m6">
        <Section variant="outlined">
          <div className="flex flex-col gap-m4">
            <InputLabel
              label={t('teams.create.name')}
              inputPlaceholder={t('teams.create.namePlaceholder')}
              inputProps={{
                value: name,
                onChange: e => setName(e.target.value),
                autoFocus: true,
              }}
            />

            <div className="flex flex-col gap-m2">
              <label htmlFor="team-description" className="typography-label-md text-text-primary">
                {t('teams.create.description')}
              </label>
              <textarea
                id="team-description"
                className="rounded-[var(--spacing-m3)] border border-border-primary bg-bg-secondary px-m5 py-m4 typography-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus resize-none"
                placeholder={t('teams.create.descriptionPlaceholder')}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <SwitchField
              checked={isJoinable}
              onChange={setIsJoinable}
              label={t('teams.create.isJoinable')}
            />
            <p className="typography-body-sm text-text-secondary">
              {t('teams.create.isJoinableHint')}
            </p>
          </div>
        </Section>

        {error && <ErrorAlert message={error} />}

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            {t('teams.create.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? t('teams.list.loading') : t('teams.create.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
