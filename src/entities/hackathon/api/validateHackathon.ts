import { platformFetchJson } from '@/shared/api/platformClient'

export type ValidationError = {
  code: string
  field?: string
  message: string
  meta?: Record<string, string>
}

export type ValidateHackathonResponse = {
  validationErrors: ValidationError[]
}

export async function validateHackathon(
  hackathonId: string
): Promise<ValidateHackathonResponse> {
  return platformFetchJson<ValidateHackathonResponse>(
    `/v1/hackathons/${hackathonId}/validate`,
    {
      method: 'GET',
    }
  )
}
