import { getHackathon } from '@/entities/hackathon/api/getHackathon'
import { HackathonDetail } from '@/features/hackathon-detail/ui/HackathonDetail'

export default async function HackathonMainPage({
  params,
}: {
  params: Promise<{ hackathonId: string }>
}) {
  const { hackathonId } = await params

  let initialData
  try {
    initialData = await getHackathon(hackathonId, {
      includeDescription: true,
      includeLinks: true,
      includeLimits: true,
    })
  } catch (error) {
    console.error('Failed to fetch hackathon:', error)
  }

  return <HackathonDetail hackathonId={hackathonId} initialData={initialData} />
}
