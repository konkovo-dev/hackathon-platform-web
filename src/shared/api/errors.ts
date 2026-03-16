/**
 * Единый тип ошибки API
 */
export interface ApiErrorData {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
  status?: number
  url?: string
}

/**
 * Класс-ошибка для UI/хуков (с доступом к status/code/fieldErrors).
 */
export class ApiError extends Error {
  readonly data: ApiErrorData

  constructor(data: ApiErrorData) {
    super(data.message)
    this.name = 'ApiError'
    this.data = data
  }
}

async function tryParseJson(response: Response): Promise<Record<string, unknown> | undefined> {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return undefined
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return undefined
  }
}

/**
 * Парсит ошибку из HTTP ответа (BFF/бекенд).
 */
export async function parseApiErrorResponse(res: Response): Promise<ApiErrorData> {
  const json = await tryParseJson(res)

  const messageFromJson = typeof json?.message === 'string' ? json.message : undefined
  const message = (messageFromJson && messageFromJson.trim()) || res.statusText || 'Request failed'

  const code = typeof json?.code === 'string' ? json.code : undefined
  const fieldErrors =
    json && typeof json.fieldErrors === 'object' && json.fieldErrors !== null
      ? (json.fieldErrors as Record<string, string[]>)
      : undefined

  return { message, code, fieldErrors, status: res.status }
}

/**
 * Нормализует неизвестную ошибку в ApiErrorData.
 */
export function toApiErrorData(error: unknown): ApiErrorData {
  if (error instanceof ApiError) return error.data

  if (error && typeof error === 'object') {
    if ('fieldErrors' in error) {
      return {
        message: 'Ошибка валидации',
        fieldErrors: (error as any).fieldErrors as Record<string, string[]>,
      }
    }

    if ('message' in error) {
      return {
        message: String((error as any).message),
        code: 'code' in error ? String((error as any).code) : undefined,
        status: 'status' in error ? Number((error as any).status) : undefined,
      }
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Произошла неизвестная ошибка' }
}
