'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { JoinRequestModal } from './JoinRequestModal'
import type { Vacancy } from '@/entities/team'

export interface JoinTeamButtonProps {
  hackathonId: string
  teamId: string
  vacancies: Vacancy[]
}

export function JoinTeamButton({ hackathonId, teamId, vacancies }: JoinTeamButtonProps) {
  const t = useT()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        {t('teams.actions.join')}
      </Button>
      <JoinRequestModal
        open={open}
        onClose={() => setOpen(false)}
        hackathonId={hackathonId}
        teamId={teamId}
        vacancies={vacancies}
      />
    </>
  )
}
