'use client'

import { useState } from 'react'
import { toAvatarImgSrc } from '@/shared/lib/avatarUrl'
import { cn } from '@/shared/lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export const AVATAR_PLACEHOLDER_ELEVATED = 'elevated' as const
export const AVATAR_PLACEHOLDER_TRANSPARENT = 'transparent' as const

export interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  className?: string
  placeholderTone?: 'default' | 'elevated' | 'transparent'
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-m12 h-m12 typography-caption-sm-regular',
  md: 'w-m16 h-m16 typography-body-sm-regular',
  lg: 'w-[48px] h-[48px] typography-body-lg-medium',
  xl: 'relative aspect-[3/4] self-stretch typography-body-lg-medium',
}

function firstLetterUpper(segment: string): string {
  const s = segment.trim()
  if (!s) return ''
  return s[0]!.toLocaleUpperCase()
}

function getInitials(name?: string | null): string {
  const trimmed = name?.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    const one = firstLetterUpper(parts[0]!)
    return one || '?'
  }
  const first = firstLetterUpper(parts[0]!)
  const last = firstLetterUpper(parts[parts.length - 1]!)
  const pair = `${first}${last}`.trim()
  return pair || '?'
}

export function Avatar({ src, name, size = 'md', className, placeholderTone = 'default' }: AvatarProps) {
  const sizeClass = sizeClasses[size]
  const isXl = size === 'xl'
  const resolvedSrc =
    typeof src === 'string' && src.trim() !== '' ? toAvatarImgSrc(src.trim()) : undefined
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const showImage = resolvedSrc && !imgFailed

  return (
    <div
      className={cn(
        'relative border border-border-default rounded-[var(--spacing-m2)] overflow-hidden shrink-0',
        'animate-in fade-in zoom-in-95 duration-200',
        !isXl && 'flex items-center justify-center',
        sizeClass,
        className
      )}
      style={isXl ? { minHeight: 0, minWidth: 0 } : undefined}
    >
      {/* Placeholder — всегда в DOM, перекрывается картинкой после загрузки */}
      <div
        className={cn(
          'flex items-center justify-center',
          placeholderTone === 'elevated'
            ? 'bg-bg-elevated'
            : placeholderTone === 'transparent'
              ? 'bg-transparent'
              : 'bg-bg-default',
          'absolute inset-0'
        )}
      >
        <span className="text-text-tertiary">{getInitials(name)}</span>
      </div>

      {/* Картинка поверх placeholder — видна только после успешной загрузки */}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={name ?? 'avatar'}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}
