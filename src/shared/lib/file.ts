export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export type FileValidationError = 'invalid_type' | 'too_large'

export function validateImageFile(
  file: File,
  opts?: { maxBytes?: number; allowedTypes?: string[] }
): FileValidationError | null {
  const allowedTypes = opts?.allowedTypes ?? IMAGE_MIME_TYPES
  const maxBytes = opts?.maxBytes ?? MAX_AVATAR_SIZE_BYTES

  if (!allowedTypes.includes(file.type)) return 'invalid_type'
  if (file.size > maxBytes) return 'too_large'
  return null
}
