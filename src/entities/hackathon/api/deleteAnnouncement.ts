import { platformFetchJson } from '@/shared/api/platformClient'

export type DeleteAnnouncementRequest = {
  idempotencyKey: {
    key: string
  }
}

export type DeleteAnnouncementResponse = {
  ok: boolean
}

export async function deleteAnnouncement(
  hackathonId: string,
  announcementId: string,
  request: DeleteAnnouncementRequest
): Promise<DeleteAnnouncementResponse> {
  return platformFetchJson<DeleteAnnouncementResponse>(
    `/v1/hackathons/${hackathonId}/announcements/${announcementId}`,
    {
      method: 'DELETE',
      body: JSON.stringify(request),
    }
  )
}
