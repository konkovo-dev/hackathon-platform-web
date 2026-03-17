import type { ApiErrorData } from '@/shared/api/errors'

const BASE = 'hackathons.detail.errors' as const

export type RegistrationErrorI18nKey =
  | `${typeof BASE}.register_failed`
  | `${typeof BASE}.already_registered`
  | `${typeof BASE}.forbidden`
  | `${typeof BASE}.not_found`
  | `${typeof BASE}.invalid_input`
  | `${typeof BASE}.unauthorized`
  | `${typeof BASE}.idempotency_conflict`
  | `${typeof BASE}.internal`

/**
 * Возвращает ключ i18n для ошибки регистрации на хакатон по ответу API.
 * Соответствует кодам и сообщениям бэкенда (participation-and-roles-service).
 */
export function getRegistrationErrorI18nKey(data: ApiErrorData): RegistrationErrorI18nKey {
  const status = data.status
  const msg = (data.message ?? '').toLowerCase()

  if (status === 409) return 'hackathons.detail.errors.already_registered'
  if (status === 403) return 'hackathons.detail.errors.forbidden'
  if (status === 404) return 'hackathons.detail.errors.not_found'
  if (status === 401) return 'hackathons.detail.errors.unauthorized'
  if (status === 400) return 'hackathons.detail.errors.invalid_input'
  if (status === 500) return 'hackathons.detail.errors.internal'

  if (msg.includes('idempotency')) return 'hackathons.detail.errors.idempotency_conflict'
  if (msg.includes('already registered')) return 'hackathons.detail.errors.already_registered'
  if (msg.includes('forbidden')) return 'hackathons.detail.errors.forbidden'
  if (msg.includes('not found')) return 'hackathons.detail.errors.not_found'
  if (msg.includes('unauthorized')) return 'hackathons.detail.errors.unauthorized'
  if (msg.includes('invalid') || msg.includes('required')) return 'hackathons.detail.errors.invalid_input'
  if (msg.includes('internal')) return 'hackathons.detail.errors.internal'

  return 'hackathons.detail.errors.register_failed'
}
