import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type DeleteAnnouncementParams =
  operations['HackathonService_DeleteHackathonAnnouncement']['parameters']['query']

export type DeleteAnnouncementResponse =
  operations['HackathonService_DeleteHackathonAnnouncement']['responses']['200']['content']['application/json']

export async function deleteAnnouncement(
  hackathonId: string,
  announcementId: string,
  params: DeleteAnnouncementParams
): Promise<DeleteAnnouncementResponse> {
  const queryParams = new URLSearchParams()
  if (params?.['idempotencyKey.key']) {
    queryParams.set('idempotencyKey.key', params['idempotencyKey.key'])
  }

  return platformFetchJson<DeleteAnnouncementResponse>(
    `/v1/hackathons/${hackathonId}/announcements/${announcementId}?${queryParams.toString()}`,
    {
      method: 'DELETE',
    }
  )
}
