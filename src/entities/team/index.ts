export { createTeam, type CreateTeamRequest, type CreateTeamResponse } from './api/createTeam'
export {
  listTeams,
  listAllTeams,
  type ListTeamsRequest,
  type ListTeamsResponse,
} from './api/listTeams'
export { listTeamRoles, type ListTeamRolesResponse } from './api/listTeamRoles'
export { getTeam, type GetTeamParams, type GetTeamResponse } from './api/getTeam'
export { updateTeam, type UpdateTeamRequest, type UpdateTeamResponse } from './api/updateTeam'
export { deleteTeam, type DeleteTeamResponse } from './api/deleteTeam'
export { listTeamMembers, type ListTeamMembersResponse } from './api/listTeamMembers'
export { leaveTeam, type LeaveTeamResponse } from './api/leaveTeam'
export { kickTeamMember, type KickTeamMemberResponse } from './api/kickTeamMember'
export {
  transferCaptain,
  type TransferCaptainRequest,
  type TransferCaptainResponse,
} from './api/transferCaptain'
export {
  upsertVacancy,
  type UpsertVacancyRequest,
  type UpsertVacancyResponse,
} from './api/upsertVacancy'
export {
  createTeamInvitation,
  type CreateTeamInvitationRequest,
  type CreateTeamInvitationResponse,
} from './api/createTeamInvitation'
export {
  listTeamInvitations,
  type ListTeamInvitationsRequest,
  type ListTeamInvitationsResponse,
} from './api/listTeamInvitations'
export { cancelTeamInvitation, type CancelTeamInvitationResponse } from './api/cancelTeamInvitation'
export {
  createJoinRequest,
  type CreateJoinRequestRequest,
  type CreateJoinRequestResponse,
} from './api/createJoinRequest'
export {
  listJoinRequests,
  type ListJoinRequestsRequest,
  type ListJoinRequestsResponse,
} from './api/listJoinRequests'
export {
  listMyJoinRequests,
  type ListMyJoinRequestsRequest,
  type ListMyJoinRequestsResponse,
} from './api/listMyJoinRequests'
export { acceptJoinRequest, type AcceptJoinRequestResponse } from './api/acceptJoinRequest'
export { rejectJoinRequest, type RejectJoinRequestResponse } from './api/rejectJoinRequest'
export {
  getMatchmakingTeams,
  type GetMatchmakingTeamsResponse,
} from './api/getMatchmakingTeams'
export {
  getMatchmakingCandidates,
  type GetMatchmakingCandidatesResponse,
} from './api/getMatchmakingCandidates'
export {
  useTeamQuery,
  useMatchmakingTeamsQuery,
  useMatchmakingCandidatesQuery,
  useJoinRequestsQuery,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
  fetchPendingJoinRequestsOrEmpty,
} from './model/hooks'

export type {
  Team,
  TeamMember,
  Vacancy,
  TeamInvitation,
  JoinRequest,
  TeamInboxStatus,
  TeamWithVacancies,
} from './model/types'
export { isPendingJoinRequest, countPendingJoinRequests } from './model/pendingJoinRequests'
