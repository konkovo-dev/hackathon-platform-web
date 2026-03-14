import { platformFetchJson } from '@/shared/api/platformClient'

export type UpdateAnnouncementRequest = {
  idempotencyKey: {
    key: string
  }
  title: string
  body: string
}

export type UpdateAnnouncementResponse = {
  ok: boolean
}

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
