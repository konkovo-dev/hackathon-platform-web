import { cn } from '@/shared/lib/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'

export type InputVariant = 'text' | 'search'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: InputVariant
  error?: boolean
  type?: InputHTMLAttributes<HTMLInputElement>['type']
}

const getVariantStyles = (variant: InputVariant, error: boolean) => {
  const baseStyles = 'flex items-center min-h-m16 overflow-hidden border border-solid transition-all duration-150'
  const borderRadius = 'rounded-[var(--spacing-m4)]' // 8px
  
  if (error) {
    return {
      container: `${baseStyles} ${borderRadius} border-state-error`,
      input: '',
    }
  }

  switch (variant) {
    case 'text':
      return {
        container: `${baseStyles} ${borderRadius} border-border-strong focus-within:border-border-focus`,
        input: '',
      }
    case 'search':
      return {
        container: `${baseStyles} ${borderRadius} border-border-strong focus-within:border-border-focus`,
        input: '',
      }
    default:
      return {
        container: `${baseStyles} ${borderRadius}`,
        input: '',
      }
  }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'text', error = false, disabled, placeholder, ...props }, ref) => {
    const variantStyles = getVariantStyles(variant, error)
    const isSearch = variant === 'search'
    
    const processedPlaceholder =
      !isSearch && typeof placeholder === 'string' && placeholder.length > 0
        ? `# ${placeholder}`
        : placeholder

    return (
      <div
        className={cn(
          variantStyles.container,
          'px-m4 py-m2',
          isSearch ? 'gap-m2' : '',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {isSearch && (
          <Icon src="/icons/icon-search/icon-search-sm.svg" size="sm" />
        )}

        <input
          ref={ref}
          type={props.type || 'text'}
          disabled={disabled}
          placeholder={processedPlaceholder}
          className={cn(
            'w-full bg-transparent border-0 outline-none',
            'typography-caption-sm-regular',
            'text-text-primary placeholder:text-text-tertiary',
            'placeholder:lowercase',
            'focus:outline-none',
            'disabled:cursor-not-allowed'
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
