import type { useT } from '@/shared/i18n/useT'

export type ValidationError = {
  code?: string
  field?: string
  message: string
  meta?: Record<string, string>
}

/**
 * Локализует ошибку валидации, комбинируя код ошибки и поле
 * Формат: "{локализованный_код}: {локализованное_поле}" или сообщение с сервера
 */
export function localizeValidationError(
  error: ValidationError,
  t: ReturnType<typeof useT>
): string {
  // Если нет кода, возвращаем сообщение с сервера
  if (!error.code) {
    return error.message
  }

  // Пытаемся локализовать код ошибки
  const errorCodeKey = `hackathons.validation.errors.${error.code}`
  const localizedCode = t(errorCodeKey as any)
  
  // Если перевода нет, используем сообщение с сервера
  if (localizedCode === errorCodeKey) {
    return error.message
  }

  // Если есть поле, пытаемся его локализовать и добавить к сообщению
  if (error.field) {
    const fieldKey = `hackathons.validation.fields.${error.field}`
    const localizedField = t(fieldKey as any)
    
    // Если поле локализовано, объединяем: "код: поле"
    if (localizedField !== fieldKey) {
      return `${localizedCode}: ${localizedField}`
    }
    
    // Иначе просто код + оригинальное имя поля
    return `${localizedCode}: ${error.field}`
  }

  // Если нет поля, возвращаем просто локализованный код
  return localizedCode
}
