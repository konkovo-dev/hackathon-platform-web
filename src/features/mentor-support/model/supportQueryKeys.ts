export const supportQueryKeys = {
  myMessages: (hackathonId: string) => ['support', 'my-messages', hackathonId] as const,
  allOpenTickets: (hackathonId: string) => ['support', 'tickets', 'all-open', hackathonId] as const,
  ticketMessages: (hackathonId: string, ticketId: string) =>
    ['support', 'ticket-messages', hackathonId, ticketId] as const,
  mentorProbe: (hackathonId: string) => ['support', 'mentor-probe', hackathonId] as const,
}

export const SUPPORT_POLL_MS = 5000
