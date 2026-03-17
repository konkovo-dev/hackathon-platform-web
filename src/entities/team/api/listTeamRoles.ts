import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListTeamRolesResponse =
  operations['ParticipationService_ListTeamRoles']['responses']['200']['content']['application/json']

export async function listTeamRoles(): Promise<ListTeamRolesResponse> {
  return platformFetchJson<ListTeamRolesResponse>('/v1/team-roles', {
    method: 'GET',
  })
}
