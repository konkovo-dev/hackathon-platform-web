import { platformFetchJson } from '@/shared/api/platformClient'
import type {
  HackathonLocation,
  HackathonDates,
  HackathonLimits,
  HackathonRegistrationPolicy,
  HackathonLink,
} from '@/entities/hackathon/model/types'

export type UpdateHackathonRequest = {
  hackathonId: string
  name?: string
  shortDescription?: string
  description?: string
  location?: HackathonLocation
  dates?: HackathonDates
  limits?: HackathonLimits
  registrationPolicy?: HackathonRegistrationPolicy
  links?: HackathonLink[]
  idempotencyKey?: {
    key: string
  }
}

export type ValidationError = {
  field: string
  message: string
}

export type UpdateHackathonResponse = {
  validationErrors?: ValidationError[]
}

export async function updateHackathon(
  request: UpdateHackathonRequest
): Promise<UpdateHackathonResponse> {
  const { hackathonId, ...body } = request

  return platformFetchJson<UpdateHackathonResponse>(`/v1/hackathons/${hackathonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
