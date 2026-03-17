import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type TransferCaptainRequest =
  operations['TeamMembersService_TransferCaptain']['requestBody']['content']['application/json']

export type TransferCaptainResponse =
  operations['TeamMembersService_TransferCaptain']['responses']['200']['content']['application/json']

export async function transferCaptain(
  hackathonId: string,
  teamId: string,
  request: TransferCaptainRequest
): Promise<TransferCaptainResponse> {
  return platformFetchJson<TransferCaptainResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/transferCaptain`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
