import { platformFetchJson } from '@/shared/api/platformClient'

export interface HackathonAnnouncement {
  announcementId: string
  hackathonId: string
  text: string
  createdAt: string
  updatedAt?: string
}

interface ListHackathonAnnouncementsResponse {
  announcements: HackathonAnnouncement[]
}

export async function getHackathonAnnouncements(
  hackathonId: string
): Promise<HackathonAnnouncement[]> {
  const path = `/v1/hackathons/${hackathonId}/announcements`

  const response = await platformFetchJson<ListHackathonAnnouncementsResponse>(path, {
    method: 'GET',
  })

  return response.announcements || []
}
