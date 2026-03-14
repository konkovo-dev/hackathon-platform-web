import { HackathonForm } from '@/features/hackathon-form/ui/HackathonForm'

const MODE = 'create' as const

export function HackathonCreateForm() {
  return <HackathonForm mode={MODE} />
}
