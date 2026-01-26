import { cn } from '@/shared/lib/cn'

export type IconProps = {
  src: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary'
  colorClassName?: string
  className?: string
}

const sizeClass: Record<NonNullable<IconProps['size']>, string> = {
  sm: 'w-m8 h-m8',
  md: 'w-m12 h-m12',
  lg: 'w-m16 h-m16',
}

export function Icon({
  src,
  size = 'md',
  color = 'primary',
  colorClassName,
  className,
}: IconProps) {
  const resolvedColorClassName =
    colorClassName ?? (color === 'secondary' ? 'bg-icon-secondary' : 'bg-icon-primary')

  return (
    <span
      aria-hidden="true"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
      className={cn(
        'flex-shrink-0',
        sizeClass[size],
        resolvedColorClassName,
        '[mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]',
        '[-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]',
        className
      )}
    />
  )
}
