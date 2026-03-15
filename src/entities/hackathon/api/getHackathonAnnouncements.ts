import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations, components } from '@/shared/api/platform.schema'

export type HackathonAnnouncement = components['schemas']['v1HackathonAnnouncement']

type ListHackathonAnnouncementsResponse =
  operations['HackathonService_ListHackathonAnnouncements']['responses']['200']['content']['application/json']

export async function getHackathonAnnouncements(
  hackathonId: string
): Promise<HackathonAnnouncement[]> {
  const path = `/v1/hackathons/${hackathonId}/announcements`

  const response = await platformFetchJson<ListHackathonAnnouncementsResponse>(path, {
    method: 'GET',
  })

  return response.announcements || []
}
