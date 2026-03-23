/** Единый ключ для участия пользователя в хакатоне (`useMyParticipationQuery`). */
export function hackathonMyParticipationQueryKey(hackathonId: string) {
  return ['hackathon', 'participation', 'me', hackathonId] as const
}
