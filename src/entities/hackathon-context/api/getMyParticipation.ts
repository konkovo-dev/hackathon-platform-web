import { platformFetchJson } from '@/shared/api/platformClient'
import type { components, operations } from '@/shared/api/platform.schema'

type GetMyParticipationResponse =
  operations['ParticipationService_GetMyParticipation']['responses']['200']['content']['application/json']
type ParticipationStatus = components['schemas']['v1ParticipationStatus']

export type MyParticipation = {
  teamId: string | null
  status: ParticipationStatus | null
  motivationText?: string
  wishedRoleIds: string[]
}

function mapWishedRoleIdsFromProfile(
  roles: components['schemas']['v1ParticipationProfile']['wishedRoles']
): string[] {
  if (!roles?.length) return []
  return roles.map(r => r?.id).filter((id): id is string => Boolean(id))
}

/**
 * Returns the authenticated user's participation for the hackathon (teamId, status, профиль заявки).
 * Used only for binding canInMyTeam to current page and for display. Not combined with permissions.
 * Returns пустое участие on 403/404 (not a participant).
 */
export async function getMyParticipation(hackathonId: string): Promise<MyParticipation> {
  try {
    const res = await platformFetchJson<GetMyParticipationResponse>(
      `/v1/hackathons/${hackathonId}/participations/me`,
      { method: 'GET' }
    )
    const p = res.participation
    const profile = p?.profile
    return {
      teamId: p?.teamId ?? null,
      status: p?.status ?? null,
      motivationText: profile?.motivationText,
      wishedRoleIds: mapWishedRoleIdsFromProfile(profile?.wishedRoles),
    }
  } catch {
    return { teamId: null, status: null, wishedRoleIds: [] }
  }
}
