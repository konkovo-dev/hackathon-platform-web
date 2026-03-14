'use client'

import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'
import { Icon } from './Icon'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg'
}

export function Modal({ open, onClose, title, subtitle, children, className, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    md: 'w-[512px]',
    lg: 'w-[768px]',
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200 p-m16"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative z-10 bg-bg-layer rounded-[var(--spacing-m8)] flex flex-col',
          sizeClasses[size],
          'max-h-full',
          'animate-in zoom-in-95 slide-in-from-bottom-4 duration-200',
          className
        )}
      >
        <div className="flex items-start justify-between shrink-0 p-m8 pb-0">
          <div className="flex flex-col gap-m2">
            <span className="typography-body-lg-medium text-text-primary">{title}</span>
            {subtitle && (
              <span className="typography-caption-sm-regular text-text-secondary">{subtitle}</span>
            )}
          </div>
          <Button
            variant="icon"
            size="xs"
            onClick={onClose}
            aria-label="Close"
            className="border border-border-strong hover:border-border-focus"
          >
            <Icon src="/icons/icon-cross/icon-cross-xs.svg" size="xs" color="secondary" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-m8 min-h-0 flex flex-col gap-m6">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
