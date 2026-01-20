import { cn } from '@/shared/lib/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'action' | 'secondary-action'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant
  size?: ButtonSize
  text?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
  if (disabled) {
    return {
      container: 'bg-bg-selected border-0',
      text: 'text-text-tertiary',
      icon: 'text-text-tertiary',
    }
  }

  switch (variant) {
    case 'primary':
      return {
        container:
          'bg-brand-primary text-text-primary hover:bg-brand-primary-hover active:bg-brand-primary-active border-0',
        text: 'text-text-primary lowercase',
        icon: 'text-text-primary',
      }
    case 'secondary':
      return {
        container:
          'bg-transparent border border-border-strong hover:border-border-focus active:border-border-focus group',
        text: 'text-text-secondary lowercase group-hover:text-text-primary group-active:text-text-primary',
        icon: 'text-text-secondary group-hover:text-text-primary group-active:text-text-primary',
      }
    case 'action':
      return {
        container: 'bg-brand-primary text-text-primary hover:bg-brand-primary-hover active:bg-brand-primary-active border-0',
        text: 'text-text-primary lowercase',
        icon: 'text-text-secondary',
      }
    case 'secondary-action':
      return {
        container: 'bg-transparent border border-border-strong hover:border-border-focus active:border-border-focus group',
        text: 'text-text-tertiary lowercase group-hover:text-text-primary group-active:text-text-primary',
        icon: 'text-text-tertiary group-hover:text-text-primary group-active:text-text-primary',
      }
    default:
      return {
        container: '',
        text: '',
        icon: '',
      }
  }
}

const getSizeStyles = (size: ButtonSize, isActionType: boolean) => {
  const gap = isActionType ? 'gap-m2' : 'gap-m5'
  
  switch (size) {
    case 'sm':
      return {
        container: `h-m16 px-m4 ${gap}`,
        text: 'typography-caption-sm-medium',
      }
    case 'md':
      return {
        container: `h-m20 px-m8 ${gap}`,
        text: 'typography-caption-sm-medium',
      }
    case 'lg':
      return {
        container: `h-m24 px-m12 ${gap}`,
        text: 'typography-caption-sm-medium',
      }
    default:
      return {
        container: '',
        text: '',
      }
  }
}

const getActionIcon = (variant: ButtonVariant) => {
  switch (variant) {
    case 'action':
      return <>&gt;</>
    case 'secondary-action':
      return <>/</>
    default:
      return null
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      text = 'текст',
      disabled = false,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const isActionType = variant === 'action' || variant === 'secondary-action'
    const variantStyles = getVariantStyles(variant, disabled)
    const sizeStyles = getSizeStyles(size, isActionType)
    const actionIcon = getActionIcon(variant)
    const displayText = children || text

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:cursor-not-allowed',
          variantStyles.container,
          sizeStyles.container,
          className
        )}
        {...props}
      >
        {isActionType && actionIcon && (
          <span className={cn(sizeStyles.text, variantStyles.icon)}>{actionIcon}</span>
        )}

        <span className={cn(sizeStyles.text, variantStyles.text, 'whitespace-nowrap')}>
          {displayText}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'
