import { platformFetchJson } from '@/shared/api/platformClient'
import type {
  HackathonLocation,
  HackathonDates,
  HackathonLimits,
  HackathonRegistrationPolicy,
  HackathonLink,
  HackathonState,
} from '@/entities/hackathon/model/types'

export type CreateHackathonRequest = {
  name: string
  shortDescription?: string
  description?: string
  location?: HackathonLocation
  dates?: HackathonDates
  limits?: HackathonLimits
  registrationPolicy?: HackathonRegistrationPolicy
  links?: HackathonLink[]
  state?: HackathonState
  idempotencyKey?: {
    key: string
  }
}

export type ValidationError = {
  field: string
  message: string
}

export type CreateHackathonResponse = {
  hackathonId: string
  validationErrors?: ValidationError[]
}

export async function createHackathon(
  request: CreateHackathonRequest
): Promise<CreateHackathonResponse> {
  return platformFetchJson<CreateHackathonResponse>('/v1/hackathons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
}
