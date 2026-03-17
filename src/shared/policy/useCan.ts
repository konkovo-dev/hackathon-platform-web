'use client'

import { useSessionQuery } from '@/features/auth/model/hooks'
import { useHackathonPermissionsQuery } from '@/entities/hackathon-permissions'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { deny, type Decision } from './decision'
import { permissionToDecision } from './permissionToDecision'

/** Actions map 1:1 to API permission fields. Team.MyTeam.* require hackathonId + teamId (checked against myTeamId). */
export type Action =
  | 'Session.Authenticated'
  | 'Hackathon.ReadDraft'
  | 'Hackathon.Manage'
  | 'Hackathon.Publish'
  | 'Hackathon.CreateAnnouncement'
  | 'Hackathon.ViewAnnouncements'
  | 'Hackathon.ReadTask'
  | 'Hackathon.ReadResultDraft'
  | 'Hackathon.UpdateResultDraft'
  | 'Hackathon.PublishResult'
  | 'Hackathon.ViewResultPublic'
  | 'Participation.Register'
  | 'Participation.Unregister'
  | 'Participation.SwitchParticipationMode'
  | 'Participation.UpdateParticipationProfile'
  | 'Participation.InviteStaff'
  | 'Participation.ListParticipants'
  | 'Team.Create'
  | 'Team.CanJoinTeam'
  | 'Team.EditTeam'
  | 'Team.DeleteTeam'
  | 'Team.InviteMember'
  | 'Team.KickMember'
  | 'Team.LeaveTeam'
  | 'Team.ManageJoinRequests'
  | 'Team.ManageVacancies'
  | 'Team.TransferCaptain'
  | 'Judging.AssignJudging'
  | 'Judging.SubmitVerdict'
  | 'Judging.ViewLeaderboard'
  | 'Judging.ViewMyJudgingAssignments'
  | 'Judging.ViewSubmissionEvaluations'

export type UseCanParams = {
  hackathonId?: string | null
  teamId?: string | null
}

export type UseCanResult = {
  decision: Decision
  isLoading: boolean
}

const HACKATHON_ACTIONS: Action[] = [
  'Hackathon.ReadDraft',
  'Hackathon.Manage',
  'Hackathon.Publish',
  'Hackathon.CreateAnnouncement',
  'Hackathon.ViewAnnouncements',
  'Hackathon.ReadTask',
  'Hackathon.ReadResultDraft',
  'Hackathon.UpdateResultDraft',
  'Hackathon.PublishResult',
  'Hackathon.ViewResultPublic',
]
const PARTICIPATION_ACTIONS: Action[] = [
  'Participation.Register',
  'Participation.Unregister',
  'Participation.SwitchParticipationMode',
  'Participation.UpdateParticipationProfile',
  'Participation.InviteStaff',
  'Participation.ListParticipants',
]
const TEAM_SCOPED_ACTIONS: Action[] = [
  'Team.EditTeam',
  'Team.DeleteTeam',
  'Team.InviteMember',
  'Team.KickMember',
  'Team.LeaveTeam',
  'Team.ManageJoinRequests',
  'Team.ManageVacancies',
  'Team.TransferCaptain',
]

function needsHackathonPermissions(action: Action): boolean {
  return (
    HACKATHON_ACTIONS.includes(action) ||
    PARTICIPATION_ACTIONS.includes(action) ||
    action === 'Team.Create' ||
    action === 'Team.CanJoinTeam' ||
    TEAM_SCOPED_ACTIONS.includes(action) ||
    action.startsWith('Judging.')
  )
}

export function useCan(action: Action, params?: UseCanParams): UseCanResult {
  const sessionQuery = useSessionQuery()
  const hackathonId = params?.hackathonId
  const teamId = params?.teamId

  const needsPermissions = needsHackathonPermissions(action)
  const permissionsQuery = useHackathonPermissionsQuery(needsPermissions ? hackathonId : undefined)
  const myParticipationQuery = useMyParticipationQuery(
    action === 'Team.CanJoinTeam' || TEAM_SCOPED_ACTIONS.includes(action) ? hackathonId : undefined
  )

  const isLoading =
    sessionQuery.isLoading ||
    (needsPermissions && permissionsQuery.isLoading) ||
    ((action === 'Team.CanJoinTeam' || TEAM_SCOPED_ACTIONS.includes(action)) &&
      myParticipationQuery.isLoading)

  if (action === 'Session.Authenticated') {
    if (sessionQuery.data?.active !== true) return { decision: deny('AUTH_REQUIRED'), isLoading }
    return { decision: { allowed: true }, isLoading }
  }

  if (sessionQuery.data?.active !== true) return { decision: deny('AUTH_REQUIRED'), isLoading }

  const perm = permissionsQuery.data
  const myTeamId = myParticipationQuery.data?.teamId ?? null
  const decision = permissionToDecision(action, perm, params, myTeamId)
  return { decision, isLoading }
}
