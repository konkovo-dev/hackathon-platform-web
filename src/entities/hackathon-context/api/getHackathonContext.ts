import { platformFetchJson } from '@/shared/api/platformClient'
import type { Hackathon } from '@/entities/hackathon/model/types'
import type { HackathonContext, ParticipationKind, StaffRole } from '../model/types'

/**
 * Participation status из API
 */
type ParticipationStatus =
  | 'PARTICIPATION_STATUS_UNSPECIFIED'
  | 'LOOKING_FOR_TEAM'
  | 'SINGLE'
  | 'TEAM'

/**
 * Ответ от /v1/hackathons/{id}/participations/me
 */
type ParticipationResponse = {
  participation: {
    hackathonId: string
    status: ParticipationStatus
    teamId?: string | null
    userId: string
    profile?: {
      motivationText?: string
      wishedRoles?: Array<{ id: string; name: string }>
    }
    registeredAt?: string
    updatedAt?: string
  }
}

/**
 * Ответ от /v1/hackathons/{id}/staff (для получения ролей текущего пользователя)
 */
type StaffResponse = {
  staff: Array<{
    userId: string
    roles: string[] // ["HACKATHON_ROLE_OWNER", "HACKATHON_ROLE_ORGANIZER", ...]
  }>
}

/**
 * Маппинг статуса участия в ParticipationKind
 */
function mapParticipationStatus(status: ParticipationStatus): ParticipationKind {
  switch (status) {
    case 'LOOKING_FOR_TEAM':
      return 'LOOKING_FOR_TEAM'
    case 'SINGLE':
      return 'SINGLE'
    case 'TEAM':
      return 'TEAM'
    default:
      return 'NONE'
  }
}

/**
 * Маппинг роли из API в StaffRole
 */
function mapStaffRole(role: string): StaffRole | null {
  switch (role) {
    case 'HACKATHON_ROLE_OWNER':
      return 'OWNER'
    case 'HACKATHON_ROLE_ORGANIZER':
      return 'ORGANIZER'
    case 'HACKATHON_ROLE_MENTOR':
      return 'MENTOR'
    case 'HACKATHON_ROLE_JURY':
      return 'JURY'
    default:
      return null
  }
}

/**
 * Получает композитный контекст хакатона для текущего пользователя
 * 
 * Комбинирует данные из:
 * 1. GET /v1/hackathons/{id} - stage, policy, result_published_at
 * 2. GET /v1/hackathons/{id}/participations/me - participation status, teamId
 * 3. GET /v1/hackathons/{id}/staff - staff roles (опционально)
 */
export async function getHackathonContext(hackathonId: string): Promise<HackathonContext> {
  const hackathon = await platformFetchJson<Hackathon>(`/v1/hackathons/${hackathonId}`, {
    method: 'GET',
  })

  let participationKind: ParticipationKind = 'NONE'
  let teamId: string | null = null

  try {
    const participationData = await platformFetchJson<ParticipationResponse>(
      `/v1/hackathons/${hackathonId}/participations/me`,
      { method: 'GET' }
    )
    participationKind = mapParticipationStatus(participationData.participation.status)
    teamId = participationData.participation.teamId || null
  } catch (error) {
  }

  let roles: StaffRole[] = []

  try {
    const staffData = await platformFetchJson<StaffResponse>(
      `/v1/hackathons/${hackathonId}/staff`,
      { method: 'GET' }
    )
    
    if (staffData.staff && staffData.staff.length > 0) {
      roles = staffData.staff[0].roles
        .map(mapStaffRole)
        .filter((role): role is StaffRole => role !== null)
    }
  } catch (error) {
  }

  return {
    hackathonId,
    stage: hackathon.stage,
    policy: {
      allow_team: hackathon.registrationPolicy?.allowTeam ?? false,
      allow_individual: hackathon.registrationPolicy?.allowIndividual ?? false,
      team_size_max: hackathon.limits?.teamSizeMax,
    },
    roles,
    particip: {
      kind: participationKind,
      team_id: teamId,
    },
    result_published_at: hackathon.resultPublishedAt || null,
  }
}
