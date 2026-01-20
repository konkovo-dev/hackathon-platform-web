import { cn } from '@/shared/lib/cn'
import { type HTMLAttributes, type ReactNode } from 'react'

export type TypographyVariant =
  | 'display-2xl'
  | 'display-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'body-lg-regular'
  | 'body-lg-medium'
  | 'body-md-regular'
  | 'body-md-medium'
  | 'body-sm-regular'
  | 'body-sm-medium'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'label-xs'
  | 'caption-sm-regular'
  | 'caption-sm-medium'
  | 'caption-xs'
  | 'overline-xs'
  | 'code-sm'

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: TypographyVariant
  as?: keyof JSX.IntrinsicElements
  children: ReactNode
}

const variantToElement: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  'display-2xl': 'h1',
  'display-xl': 'h1',
  'heading-lg': 'h2',
  'heading-md': 'h3',
  'heading-sm': 'h4',
  'title-lg': 'h5',
  'title-md': 'h6',
  'title-sm': 'h6',
  'body-lg-regular': 'p',
  'body-lg-medium': 'p',
  'body-md-regular': 'p',
  'body-md-medium': 'p',
  'body-sm-regular': 'p',
  'body-sm-medium': 'p',
  'label-lg': 'span',
  'label-md': 'span',
  'label-sm': 'span',
  'label-xs': 'span',
  'caption-sm-regular': 'span',
  'caption-sm-medium': 'span',
  'caption-xs': 'span',
  'overline-xs': 'span',
  'code-sm': 'code',
}

export function Typography({ variant, as, children, className, ...props }: TypographyProps) {
  const Component = as || variantToElement[variant]
  const typographyClass = `typography-${variant}`

  return (
    <Component className={cn(typographyClass, className)} {...props}>
      {children}
    </Component>
  )
}
