import { platformFetchJson } from '@/shared/api/platformClient'

export type CreateAnnouncementRequest = {
  idempotencyKey: string
  title: string
  body: string
}

export type CreateAnnouncementResponse = {
  announcementId: string
}

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
