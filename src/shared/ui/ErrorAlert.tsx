'use client'

export interface ErrorAlertProps {
  /** Error message to display (already localized or from API). */
  message: string
  /** Optional additional class for the wrapper (e.g. shrink-0). */
  className?: string
}

/**
 * Inline error alert for forms and modals. Use for API/validation errors.
 * Message should be localized at the call site or passed from API.
 */
export function ErrorAlert({ message, className }: ErrorAlertProps) {
  return (
    <div
      className={`rounded-[var(--spacing-m3)] bg-state-error/10 px-m6 py-m4 border border-state-error ${className ?? ''}`.trim()}
      role="alert"
      aria-live="polite"
    >
      <p className="typography-body-sm-regular text-state-error">{message}</p>
    </div>
  )
}
