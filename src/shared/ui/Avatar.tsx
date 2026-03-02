import { cn } from '@/shared/lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-m12 h-m12 typography-caption-sm-regular',
  md: 'w-m16 h-m16 typography-body-sm-regular',
  lg: 'w-[48px] h-[48px] typography-body-lg-medium',
  xl: 'relative aspect-[3/4] self-stretch typography-body-lg-medium',
}

function getInitials(name?: string | null): string {
  return name?.trim()[0]?.toUpperCase() ?? '?'
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizeClass = sizeClasses[size]
  const isXl = size === 'xl'

  return (
    <div
      className={cn(
        'border border-border-default rounded-m2 overflow-hidden shrink-0',
        'animate-in fade-in zoom-in-95 duration-200',
        !isXl && 'flex items-center justify-center',
        sizeClass,
        className
      )}
      style={isXl ? { minHeight: 0, minWidth: 0 } : undefined}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? 'avatar'}
          className={cn(
            isXl ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-full object-cover',
            'transition-opacity duration-300'
          )}
        />
      ) : (
        <div
          className={cn(
            'bg-bg-default flex items-center justify-center',
            isXl ? 'absolute inset-0' : 'w-full h-full'
          )}
        >
          <span className="text-text-tertiary">{getInitials(name)}</span>
        </div>
      )}
    </div>
  )
}
