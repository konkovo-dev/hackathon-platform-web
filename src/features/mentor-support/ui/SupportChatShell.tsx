'use client'

import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** Область прокрутки ленты сообщений (без отдельной рамки — как часть экрана чата). */
export function SupportChatThread({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-m4 overflow-y-auto overflow-x-hidden py-m2',
        className
      )}
    >
      {children}
    </div>
  )
}

/** Блок ввода под лентой. */
export function SupportChatComposer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 flex shrink-0 flex-col gap-m4 border-t border-border-default bg-bg-surface pt-m5',
        'pb-[max(1rem,env(safe-area-inset-bottom,0px))]',
        className
      )}
    >
      {children}
    </div>
  )
}
