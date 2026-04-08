import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

const base = (hackathonId: string) => `/v1/hackathons/${hackathonId}/support`

export type SupportSendMessageBody =
  operations['MentorsService_SendMessage']['requestBody']['content']['application/json']
export type SupportSendMessageResponse =
  operations['MentorsService_SendMessage']['responses']['200']['content']['application/json']

export type SupportGetMyChatMessagesResponse =
  operations['MentorsService_GetMyChatMessages']['responses']['200']['content']['application/json']

export type SupportGetRealtimeTokenResponse =
  operations['MentorsService_GetRealtimeToken']['responses']['200']['content']['application/json']

export type SupportListAllTicketsBody =
  operations['MentorsService_ListAllTickets']['requestBody']['content']['application/json']
export type SupportListAllTicketsResponse =
  operations['MentorsService_ListAllTickets']['responses']['200']['content']['application/json']

export type SupportListAssignedTicketsBody =
  operations['MentorsService_ListAssignedTickets']['requestBody']['content']['application/json']
export type SupportListAssignedTicketsResponse =
  operations['MentorsService_ListAssignedTickets']['responses']['200']['content']['application/json']

export type SupportClaimTicketBody =
  operations['MentorsService_ClaimTicket']['requestBody']['content']['application/json']
export type SupportClaimTicketResponse =
  operations['MentorsService_ClaimTicket']['responses']['200']['content']['application/json']

export type SupportReplyBody =
  operations['MentorsService_ReplyInTicket']['requestBody']['content']['application/json']
export type SupportReplyResponse =
  operations['MentorsService_ReplyInTicket']['responses']['200']['content']['application/json']

export type SupportCloseTicketBody =
  operations['MentorsService_CloseTicket']['requestBody']['content']['application/json']

export type SupportGetTicketMessagesResponse =
  operations['MentorsService_GetTicketMessages']['responses']['200']['content']['application/json']

export async function sendSupportMessage(
  hackathonId: string,
  body: SupportSendMessageBody
): Promise<SupportSendMessageResponse> {
  return platformFetchJson<SupportSendMessageResponse>(`${base(hackathonId)}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getMySupportChatMessages(
  hackathonId: string
): Promise<SupportGetMyChatMessagesResponse> {
  return platformFetchJson<SupportGetMyChatMessagesResponse>(`${base(hackathonId)}/my-messages`, {
    method: 'GET',
  })
}

export async function getSupportRealtimeToken(
  hackathonId: string
): Promise<SupportGetRealtimeTokenResponse> {
  return platformFetchJson<SupportGetRealtimeTokenResponse>(`${base(hackathonId)}/realtime-token`, {
    method: 'GET',
  })
}

export async function listAllSupportTickets(
  hackathonId: string,
  body: SupportListAllTicketsBody
): Promise<SupportListAllTicketsResponse> {
  return platformFetchJson<SupportListAllTicketsResponse>(
    `${base(hackathonId)}/tickets/all/list`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  )
}

export async function listAssignedSupportTickets(
  hackathonId: string,
  body: SupportListAssignedTicketsBody
): Promise<SupportListAssignedTicketsResponse> {
  return platformFetchJson<SupportListAssignedTicketsResponse>(
    `${base(hackathonId)}/tickets/assigned/list`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  )
}

export async function claimSupportTicket(
  hackathonId: string,
  ticketId: string,
  body: SupportClaimTicketBody
): Promise<SupportClaimTicketResponse> {
  return platformFetchJson<SupportClaimTicketResponse>(
    `${base(hackathonId)}/tickets/${ticketId}/claim`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  )
}

export async function replyInSupportTicket(
  hackathonId: string,
  ticketId: string,
  body: SupportReplyBody
): Promise<SupportReplyResponse> {
  return platformFetchJson<SupportReplyResponse>(
    `${base(hackathonId)}/tickets/${ticketId}/reply`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  )
}

export async function closeSupportTicket(
  hackathonId: string,
  ticketId: string,
  body: SupportCloseTicketBody
): Promise<void> {
  await platformFetchJson<Record<string, never>>(
    `${base(hackathonId)}/tickets/${ticketId}/close`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  )
}

export async function getSupportTicketMessages(
  hackathonId: string,
  ticketId: string
): Promise<SupportGetTicketMessagesResponse> {
  return platformFetchJson<SupportGetTicketMessagesResponse>(
    `${base(hackathonId)}/tickets/${ticketId}/messages`,
    { method: 'GET' }
  )
}
