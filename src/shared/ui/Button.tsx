import { cn } from '@/shared/lib/cn'
import { cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'action' | 'secondary-action' | 'icon' | 'icon-secondary'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant
  size?: ButtonSize
  text?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  asChild?: boolean
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
        container:
          'bg-brand-primary text-text-primary hover:bg-brand-primary-hover active:bg-brand-primary-active border-0',
        text: 'text-text-primary lowercase',
        icon: 'text-text-secondary',
      }
    case 'secondary-action':
      return {
        container:
          'bg-transparent border border-border-strong hover:border-border-focus active:border-border-focus group',
        text: 'text-text-tertiary lowercase group-hover:text-text-primary group-active:text-text-primary',
        icon: 'text-text-tertiary group-hover:text-text-primary group-active:text-text-primary',
      }
    case 'icon':
      return {
        container:
          'bg-transparent border-0 rounded-[var(--spacing-m4)] hover:bg-bg-hover active:bg-bg-selected',
        text: 'text-text-primary',
        icon: 'text-icon-secondary',
      }
    case 'icon-secondary':
      return {
        container:
          'bg-transparent border border-border-strong hover:border-border-focus active:border-border-focus group',
        text: 'text-text-primary',
        icon: 'text-text-secondary group-hover:text-text-primary group-active:text-text-primary',
      }
    default:
      return {
        container: '',
        text: '',
        icon: '',
      }
  }
}

const getSizeStyles = (size: ButtonSize, isActionType: boolean, isIcon: boolean) => {
  const gap = isActionType ? 'gap-m2' : 'gap-m5'
  if (isIcon) {
    switch (size) {
      case 'xs':
        return { container: 'p-m2', text: 'typography-caption-sm-medium' }
      case 'sm':
        return { container: 'h-m16 w-m16 p-0', text: 'typography-caption-sm-medium' }
      case 'md':
        return { container: 'h-m20 w-m20 p-0', text: 'typography-caption-sm-medium' }
      case 'lg':
        return { container: 'h-m24 w-m24 p-0', text: 'typography-caption-sm-medium' }
      default:
        return { container: '', text: '' }
    }
  }

  switch (size) {
    case 'xs':
      return {
        container: `p-m2 ${gap}`,
        text: 'typography-caption-sm-medium',
      }
    case 'sm':
      return {
        container: `h-m16 px-m4 ${gap}`,
        text: 'typography-caption-sm-medium',
      }
    case 'md':
      return {
        container: `h-m16 px-m8 ${gap}`,
        text: 'typography-caption-sm-medium',
      }
    case 'lg':
      return {
        container: `h-m16 px-m12 ${gap}`,
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
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const isActionType = variant === 'action' || variant === 'secondary-action'
    const isIcon = variant === 'icon' || variant === 'icon-secondary'
    const variantStyles = getVariantStyles(variant, disabled)
    const sizeStyles = getSizeStyles(size, isActionType, isIcon)
    const actionIcon = getActionIcon(variant)
    const displayText = asChild ? text : children || text

    const baseClassName = cn(
      'inline-flex items-center justify-center transition-all duration-150',
      'rounded-[var(--spacing-m4)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
      disabled && 'pointer-events-none cursor-not-allowed',
      variantStyles.container,
      sizeStyles.container,
      className
    )

    const content = isIcon ? (
      <>{children}</>
    ) : (
      <>
        {isActionType && actionIcon && (
          <span className={cn(sizeStyles.text, variantStyles.icon)}>{actionIcon}</span>
        )}
        <span className={cn(sizeStyles.text, variantStyles.text, 'whitespace-nowrap')}>
          {displayText}
        </span>
      </>
    )

    if (asChild) {
      if (!isValidElement(children)) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('<Button asChild> expects a single valid React element child')
        }
        return null
      }

      const childProps: Record<string, unknown> = {
        ...props,
        className: cn(baseClassName, (children as any).props?.className),
        children: content,
        ...(disabled
          ? {
              'aria-disabled': true,
              tabIndex: -1,
              onClick: (e: any) => {
                e.preventDefault?.()
              },
            }
          : null),
      }

      return cloneElement(children as any, childProps)
    }

    return (
      <button ref={ref} type={type} disabled={disabled} className={baseClassName} {...props}>
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
