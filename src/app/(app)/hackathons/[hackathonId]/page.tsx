import { getHackathonServer } from '@/entities/hackathon/api/getHackathon.server'
import { HackathonDetail } from '@/features/hackathon-detail/ui/HackathonDetail'
import { ApiError } from '@/shared/api/errors'

export default async function HackathonMainPage({
  params,
}: {
  params: Promise<{ hackathonId: string }>
}) {
  const { hackathonId } = await params

  let initialData
  try {
    initialData = await getHackathonServer(hackathonId, {
      includeDescription: true,
      includeLinks: true,
      includeLimits: true,
    })
  } catch (error) {
    if (error instanceof ApiError && error.data.status === 401) {
    } else {
      console.error('Failed to fetch hackathon:', error)
    }
  }

  return <HackathonDetail hackathonId={hackathonId} initialData={initialData} />
}
