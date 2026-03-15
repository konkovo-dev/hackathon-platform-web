import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type CreateAnnouncementRequest =
  operations['HackathonService_CreateHackathonAnnouncement']['requestBody']['content']['application/json']

export type CreateAnnouncementResponse =
  operations['HackathonService_CreateHackathonAnnouncement']['responses']['200']['content']['application/json']

export async function createAnnouncement(
  hackathonId: string,
  request: CreateAnnouncementRequest
): Promise<CreateAnnouncementResponse> {
  return platformFetchJson<CreateAnnouncementResponse>(
    `/v1/hackathons/${hackathonId}/announcements`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
