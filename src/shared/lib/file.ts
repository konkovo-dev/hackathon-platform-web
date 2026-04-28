export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export const SUBMISSION_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.zip',
  '.png',
  '.jpg',
  '.jpeg',
  '.txt',
  '.md',
  '.csv',
] as const

export const SUBMISSION_ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/zip',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/markdown',
  'text/csv',
] as const

export const MAX_SUBMISSION_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

const SUBMISSION_EXT_TO_MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.csv': 'text/csv',
}

/** Comma-separated list for `<input type="file" accept="…" />`. */
export const SUBMISSION_FILE_ACCEPT = [
  ...SUBMISSION_ALLOWED_CONTENT_TYPES,
  ...SUBMISSION_ALLOWED_EXTENSIONS,
].join(',')

export type FileValidationError = 'invalid_type' | 'too_large'

export function fileLowerExtension(filename: string): string {
  const name = filename.trim().toLowerCase()
  const lastDot = name.lastIndexOf('.')
  if (lastDot <= 0 || lastDot >= name.length - 1) return ''
  return name.slice(lastDot)
}

function normalizeBrowserMimeType(mime: string): string {
  const m = mime.trim().toLowerCase()
  if (m === 'image/jpg') return 'image/jpeg'
  return m
}

function isAllowedSubmissionMime(mime: string): boolean {
  const m = normalizeBrowserMimeType(mime)
  return (SUBMISSION_ALLOWED_CONTENT_TYPES as readonly string[]).includes(m)
}

/**
 * Resolves the Content-Type to send to the submission upload API.
 * Fills in from extension when the browser reports an empty or generic type.
 */
export function resolveSubmissionContentType(file: File): string | null {
  const ext = fileLowerExtension(file.name)
  const fromExt = SUBMISSION_EXT_TO_MIME[ext]
  if (!fromExt) return null

  const raw = file.type.trim().toLowerCase()
  const normalized = normalizeBrowserMimeType(file.type)

  if (isAllowedSubmissionMime(normalized)) return normalized
  if (raw === '' || raw === 'application/octet-stream') return fromExt
  // Common OS/browser quirks still accepted by our extension + intended format
  if (ext === '.md' && raw === 'text/plain') return 'text/markdown'
  if (ext === '.csv' && (raw === 'application/vnd.ms-excel' || raw === 'text/csv'))
    return 'text/csv'

  return null
}

export function validateSubmissionFile(file: File): FileValidationError | null {
  if (file.size > MAX_SUBMISSION_FILE_SIZE_BYTES) return 'too_large'
  const ext = fileLowerExtension(file.name)
  if (!(SUBMISSION_ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return 'invalid_type'
  }
  if (resolveSubmissionContentType(file) == null) return 'invalid_type'
  return null
}

/** Human-readable file size (binary units). */
export function formatBinarySize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  let u = 0
  let n = bytes
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024
    u++
  }
  const decimals = u === 0 ? 0 : n < 10 ? 2 : n < 100 ? 1 : 0
  const rounded = Number(n.toFixed(decimals))
  return `${rounded} ${units[u]}`
}

/** Uppercase extension without dot (e.g. `report.PDF` → `PDF`). */
export function submissionFileFormatLabel(filename: string): string {
  const ext = fileLowerExtension(filename)
  if (ext.length <= 1) return '—'
  return ext.slice(1).toUpperCase()
}

/** `EXT • 1.2 MB` */
export function submissionFileMetaPlain(filename: string, sizeBytes: number): string {
  return `${submissionFileFormatLabel(filename)} \u2022 ${formatBinarySize(sizeBytes)}`
}

/** `• EXT • 1.2 MB` */
export function submissionFileMetaSuffix(filename: string, sizeBytes: number): string {
  return `\u2022 ${submissionFileMetaPlain(filename, sizeBytes)}`
}

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
