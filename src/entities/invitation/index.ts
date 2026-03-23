export {
  listMyStaffInvitations,
  type ListMyStaffInvitationsResponse,
} from './api/listMyStaffInvitations'
export {
  listMyTeamInvitations,
  type ListMyTeamInvitationsResponse,
} from './api/listMyTeamInvitations'
export {
  acceptStaffInvitation,
  type AcceptStaffInvitationResponse,
} from './api/acceptStaffInvitation'
export {
  rejectStaffInvitation,
  type RejectStaffInvitationResponse,
} from './api/rejectStaffInvitation'
export { acceptTeamInvitation, type AcceptTeamInvitationResponse } from './api/acceptTeamInvitation'
export { rejectTeamInvitation, type RejectTeamInvitationResponse } from './api/rejectTeamInvitation'

export type {
  StaffInvitation,
  TeamInvitation,
  StaffInvitationStatus,
  TeamInvitationStatus,
  HackathonRole,
} from './model/types'
