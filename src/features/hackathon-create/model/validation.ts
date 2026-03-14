export type FieldErrors = Record<string, boolean>

export interface ValidationResult {
  isValid: boolean
  errors: FieldErrors
  message?: string
}


export function validateHackathonForm(data: { name: string }): ValidationResult {
  const errors: FieldErrors = {}
  let message: string | undefined

  if (!data.name || data.name.trim().length === 0) {
    errors.name = true
    message = 'Название хакатона обязательно'
  } else if (data.name.trim().length < 3) {
    errors.name = true
    message = 'Название должно быть минимум 3 символа'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    message,
  }
}
