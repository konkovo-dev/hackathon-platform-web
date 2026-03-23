'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCan } from '@/shared/policy/useCan'
import { CreateTeamModal } from './CreateTeamModal'

export interface CreateTeamButtonProps {
  hackathonId: string
}

export function CreateTeamButton({ hackathonId }: CreateTeamButtonProps) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const { decision: canCreateTeamDecision, isLoading } = useCan('Team.Create', { hackathonId })

  if (isLoading || !canCreateTeamDecision.allowed) return null

  return (
    <>
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        {t('teams.create.button')}
      </Button>
      <CreateTeamModal open={open} onClose={() => setOpen(false)} hackathonId={hackathonId} />
    </>
  )
}
