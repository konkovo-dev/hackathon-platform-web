'use client'

import { cn } from '@/shared/lib/cn'
import { SupportRealtimeProvider } from '../model/SupportRealtimeProvider'
import { ParticipantChatPanel } from './ParticipantChatPanel'
import { MentorDashboard } from './MentorDashboard'

export interface SupportTabContentProps {
  hackathonId: string
  showStaffDashboard: boolean
  canManage: boolean
  className?: string
}

export function SupportTabContent({
  hackathonId,
  showStaffDashboard,
  canManage,
  className,
}: SupportTabContentProps) {
  return (
    <div className={cn('flex min-h-0 w-full flex-1 flex-col', className)}>
      <SupportRealtimeProvider hackathonId={hackathonId}>
        {showStaffDashboard ? (
          <MentorDashboard hackathonId={hackathonId} canManage={canManage} />
        ) : (
          <ParticipantChatPanel hackathonId={hackathonId} />
        )}
      </SupportRealtimeProvider>
    </div>
  )
}
