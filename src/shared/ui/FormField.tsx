import { cn } from '@/shared/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  error?: string
  label?: string
  labelFor?: string
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, error, label, labelFor, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label htmlFor={labelFor} className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
        {children}
        {error && (
          <p className="text-sm text-destructive" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
