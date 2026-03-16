import { cn } from '@/shared/lib/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'

export type InputVariant = 'text' | 'search'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: InputVariant
  error?: boolean
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  onClear?: () => void
}

const getVariantStyles = (variant: InputVariant, error: boolean) => {
  const baseStyles =
    'flex items-center min-h-m16 overflow-hidden border border-solid transition-all duration-150'
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
  ({ className, variant = 'text', error = false, disabled, placeholder, value, onClear, onChange, ...props }, ref) => {
    const variantStyles = getVariantStyles(variant, error)
    const isSearch = variant === 'search'
    const hasValue = Boolean(value && String(value).length > 0)

    const processedPlaceholder =
      !isSearch && typeof placeholder === 'string' && placeholder.length > 0
        ? `# ${placeholder}`
        : placeholder

    const handleClear = () => {
      if (onClear) {
        onClear()
      }
    }

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
        {isSearch && <Icon src="/icons/icon-search/icon-search-sm.svg" size="sm" />}

        <input
          ref={ref}
          type={props.type || 'text'}
          disabled={disabled}
          placeholder={processedPlaceholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={cn(
            'w-full bg-transparent border-0 outline-none',
            'typography-caption-sm-regular',
            'text-text-primary placeholder:text-text-tertiary',
            'placeholder:lowercase',
            'focus:outline-none',
            'disabled:cursor-not-allowed'
          )}
          {...props}
          value={value}
          onChange={onChange}
        />

        {isSearch && hasValue && onClear && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 w-m8 h-m8 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Clear search"
          >
            <Icon src="/icons/icon-cross/icon-cross-sm.svg" size="sm" color="secondary" />
          </button>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
