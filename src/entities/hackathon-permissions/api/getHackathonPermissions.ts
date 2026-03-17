import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/platform.schema'

type HackathonPermissions = components['schemas']['v1HackathonPermissions']
type ParticipationPermissions = components['schemas']['v1ParticipationPermissions']
type TeamPermissions = components['schemas']['v1TeamPermissions']
type JudgingPermissions = components['schemas']['v1JudgingPermissions']

export type HackathonPermissionsBundle = {
  hackathon: HackathonPermissions | undefined
  participation: ParticipationPermissions | undefined
  team: TeamPermissions | undefined
  judging: JudgingPermissions | undefined
}

/**
 * Fetches all four permission endpoints in parallel. Single source of truth for access decisions.
 * Does not combine with hackathon/participations/me/staff data.
 */
export async function getHackathonPermissions(
  hackathonId: string
): Promise<HackathonPermissionsBundle> {
  const base = `/v1/hackathons/${hackathonId}`

  const [hackathonRes, participationRes, teamRes, judgingRes] = await Promise.all([
    platformFetchJson<{ permissions?: HackathonPermissions }>(`${base}/permissions`, {
      method: 'GET',
    }),
    platformFetchJson<{ permissions?: ParticipationPermissions }>(
      `${base}/participations/permissions`,
      { method: 'GET' }
    ),
    platformFetchJson<{ permissions?: TeamPermissions }>(`${base}/teams/permissions`, {
      method: 'GET',
    }),
    platformFetchJson<{ permissions?: JudgingPermissions }>(`${base}/judging/permissions`, {
      method: 'GET',
    }),
  ])

  return {
    hackathon: hackathonRes.permissions,
    participation: participationRes.permissions,
    team: teamRes.permissions,
    judging: judgingRes.permissions,
  }
}
