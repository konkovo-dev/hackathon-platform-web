import type { HackathonPermissionsBundle } from '@/entities/hackathon-permissions'
import { deny, type Decision } from './decision'
import type { Action, UseCanParams } from './useCan'

const HACKATHON_MAP: Record<string, keyof NonNullable<HackathonPermissionsBundle['hackathon']>> = {
  'Hackathon.ReadDraft': 'readDraft',
  'Hackathon.Manage': 'manageHackathon',
  'Hackathon.Publish': 'publishHackathon',
  'Hackathon.CreateAnnouncement': 'createAnnouncement',
  'Hackathon.ViewAnnouncements': 'viewAnnouncements',
  'Hackathon.ReadTask': 'readTask',
  'Hackathon.ReadResultDraft': 'readResultDraft',
  'Hackathon.UpdateResultDraft': 'updateResultDraft',
  'Hackathon.PublishResult': 'publishResult',
  'Hackathon.ViewResultPublic': 'viewResultPublic',
}

const PARTICIPATION_MAP: Record<
  string,
  keyof NonNullable<HackathonPermissionsBundle['participation']>
> = {
  'Participation.Register': 'register',
  'Participation.Unregister': 'unregister',
  'Participation.SwitchParticipationMode': 'switchParticipationMode',
  'Participation.UpdateParticipationProfile': 'updateParticipationProfile',
  'Participation.InviteStaff': 'inviteStaff',
  'Participation.ListParticipants': 'listParticipants',
}

const TEAM_MY_TEAM_MAP: Record<
  string,
  keyof NonNullable<NonNullable<HackathonPermissionsBundle['team']>['canInMyTeam']>
> = {
  'Team.EditTeam': 'editTeam',
  'Team.DeleteTeam': 'deleteTeam',
  'Team.InviteMember': 'inviteMember',
  'Team.KickMember': 'kickMember',
  'Team.LeaveTeam': 'leaveTeam',
  'Team.ManageJoinRequests': 'manageJoinRequests',
  'Team.ManageVacancies': 'manageVacancies',
  'Team.TransferCaptain': 'transferCaptain',
}

const JUDGING_MAP: Record<string, keyof NonNullable<HackathonPermissionsBundle['judging']>> = {
  'Judging.AssignJudging': 'assignJudging',
  'Judging.SubmitVerdict': 'submitVerdict',
  'Judging.ViewLeaderboard': 'viewLeaderboard',
  'Judging.ViewMyJudgingAssignments': 'viewMyJudgingAssignments',
  'Judging.ViewSubmissionEvaluations': 'viewSubmissionEvaluations',
}

const TEAM_SCOPED_ACTIONS = new Set(Object.keys(TEAM_MY_TEAM_MAP) as Action[])

/**
 * Pure mapping: API permissions + myTeamId/teamId -> Decision.
 * Call only when user is authenticated (except Session.Authenticated).
 */
export function permissionToDecision(
  action: Action,
  permissions: HackathonPermissionsBundle | null | undefined,
  params: UseCanParams | undefined,
  myTeamId: string | null
): Decision {
  const teamId = params?.teamId

  if (HACKATHON_MAP[action]) {
    const key = HACKATHON_MAP[action]
    if (!permissions?.hackathon) return deny('NOT_ALLOWED')
    return permissions.hackathon[key] === true ? { allowed: true } : deny('NOT_ALLOWED')
  }

  if (PARTICIPATION_MAP[action]) {
    const key = PARTICIPATION_MAP[action]
    if (!permissions?.participation) return deny('NOT_ALLOWED')
    return permissions.participation[key] === true ? { allowed: true } : deny('NOT_ALLOWED')
  }

  if (action === 'Team.Create') {
    if (!permissions?.team) return deny('NOT_ALLOWED')
    return permissions.team.createTeam === true ? { allowed: true } : deny('NOT_ALLOWED')
  }

  if (action === 'Team.CanJoinTeam') {
    if (!permissions?.participation?.register) return deny('NOT_ALLOWED')
    if (myTeamId !== null) return deny('ALREADY_IN_TEAM')
    return { allowed: true }
  }

  if (TEAM_SCOPED_ACTIONS.has(action)) {
    const key = TEAM_MY_TEAM_MAP[action]
    if (!key || !permissions?.team?.canInMyTeam) return deny('NOT_ALLOWED')
    if (permissions.team.canInMyTeam[key] !== true) return deny('NOT_ALLOWED')
    if (teamId != null && myTeamId !== teamId) return deny('NOT_ALLOWED')
    return { allowed: true }
  }

  if (action.startsWith('Judging.')) {
    const key = JUDGING_MAP[action]
    if (!key || !permissions?.judging) return deny('NOT_ALLOWED')
    return permissions.judging[key] === true ? { allowed: true } : deny('NOT_ALLOWED')
  }

  return deny('NOT_ALLOWED')
}
