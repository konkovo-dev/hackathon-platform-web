import { HackathonForm } from '@/features/hackathon-form/ui/HackathonForm'
import type { Hackathon } from '@/entities/hackathon/model/types'

interface HackathonEditFormProps {
  hackathonId: string
  initialData: Hackathon
}

const MODE = 'edit' as const

export function HackathonEditForm({ hackathonId, initialData }: HackathonEditFormProps) {
  return <HackathonForm mode={MODE} hackathonId={hackathonId} initialData={initialData} />
}
