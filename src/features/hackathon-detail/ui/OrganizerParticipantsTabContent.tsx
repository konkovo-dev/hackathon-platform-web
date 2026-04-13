'use client'

import type { Hackathon } from '@/entities/hackathon/model/types'
import { StaffSubmissionsSection } from '@/features/submission'
import { TeamModerationList } from '@/features/team-moderation/ui/TeamModerationList'

export interface OrganizerParticipantsTabContentProps {
  hackathon: Hackathon
}

export function OrganizerParticipantsTabContent({ hackathon }: OrganizerParticipantsTabContentProps) {
  const hackathonId = hackathon.hackathonId ?? ''

  return (
    <div className="flex flex-col gap-m8">
      <TeamModerationList hackathonId={hackathonId} />
      <StaffSubmissionsSection hackathon={hackathon} />
    </div>
  )
}
