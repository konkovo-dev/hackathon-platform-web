import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type SwitchBody =
  operations['ParticipationService_SwitchParticipationMode']['requestBody']['content']['application/json']
type SwitchResponse =
  operations['ParticipationService_SwitchParticipationMode']['responses']['200']['content']['application/json']

/**
 * Переключает режим участия между индивидуальным и «в поиске команды».
 */
export async function switchParticipationMode(
  hackathonId: string,
  request: SwitchBody
): Promise<SwitchResponse> {
  return platformFetchJson<SwitchResponse>(
    `/v1/hackathons/${hackathonId}/participations/me/switchMode`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
