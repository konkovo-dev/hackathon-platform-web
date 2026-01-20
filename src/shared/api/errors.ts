/**
 * Единый тип ошибки API
 */
export interface ApiError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
  status?: number
}

/**
 * Нормализует ошибку API в единый формат
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error && typeof error === 'object') {
    // Ошибка от openapi-fetch
    if ('error' in error) {
      const fetchError = error as { error: unknown; response?: Response }
      const response = fetchError.response

      if (response) {
        // Попытка получить сообщение об ошибке из ответа
        // В реальном использовании здесь можно распарсить response.json()
        return {
          message: response.statusText || 'Ошибка при выполнении запроса',
          status: response.status,
        }
      }
    }

    // Ошибка с полями (валидация)
    if ('fieldErrors' in error) {
      return {
        message: 'Ошибка валидации',
        fieldErrors: error.fieldErrors as Record<string, string[]>,
      }
    }

    // Ошибка с сообщением
    if ('message' in error) {
      return {
        message: String(error.message),
        code: 'code' in error ? String(error.code) : undefined,
      }
    }
  }

  // Неизвестная ошибка
  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'Произошла неизвестная ошибка',
  }
}
