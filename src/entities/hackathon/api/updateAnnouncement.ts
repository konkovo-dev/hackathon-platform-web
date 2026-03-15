import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type UpdateAnnouncementRequest =
  operations['HackathonService_UpdateHackathonAnnouncement']['requestBody']['content']['application/json']

export type UpdateAnnouncementResponse =
  operations['HackathonService_UpdateHackathonAnnouncement']['responses']['200']['content']['application/json']

export async function updateAnnouncement(
  hackathonId: string,
  announcementId: string,
  request: UpdateAnnouncementRequest
): Promise<UpdateAnnouncementResponse> {
  return platformFetchJson<UpdateAnnouncementResponse>(
    `/v1/hackathons/${hackathonId}/announcements/${announcementId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}
