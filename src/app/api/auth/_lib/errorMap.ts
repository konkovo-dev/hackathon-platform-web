import 'server-only'

export type BffErrorCode =
  | 'INVALID_PAYLOAD'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_PASSWORD'
  | 'USER_ALREADY_EXISTS'
  | 'INVALID_USERNAME'
  | 'INVALID_EMAIL'
  | 'AUTH_REQUIRED'
  | 'UNKNOWN'

export type BffErrorResponse = {
  message: string
  code?: BffErrorCode
  fieldErrors?: Record<string, string[]>
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined
}

export function mapAuthGatewayErrorToBff(error: unknown): BffErrorResponse {
  const obj = error && typeof error === 'object' ? (error as Record<string, unknown>) : {}
  const msg = asString(obj.message) || 'Auth request failed'
  const msgLower = msg.toLowerCase()

  if (msgLower === 'invalid password') {
    return {
      message: msg,
      code: 'INVALID_PASSWORD',
      fieldErrors: { password: ['INVALID_PASSWORD'] },
    }
  }

  if (msgLower === 'invalid credentials') {
    return {
      message: msg,
      code: 'INVALID_CREDENTIALS',
      fieldErrors: { login: ['INVALID_CREDENTIALS'], password: ['INVALID_CREDENTIALS'] },
    }
  }

  if (msgLower === 'user already exists') {
    return {
      message: msg,
      code: 'USER_ALREADY_EXISTS',
      fieldErrors: { username: ['USER_ALREADY_EXISTS'], email: ['USER_ALREADY_EXISTS'] },
    }
  }

  if (msgLower === 'invalid username') {
    return {
      message: msg,
      code: 'INVALID_USERNAME',
      fieldErrors: { username: ['INVALID_USERNAME'] },
    }
  }

  if (msgLower === 'invalid email') {
    return { message: msg, code: 'INVALID_EMAIL', fieldErrors: { email: ['INVALID_EMAIL'] } }
  }

  return { message: msg, code: 'UNKNOWN' }
}
