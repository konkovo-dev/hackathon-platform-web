import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('container mx-auto max-w-[1080px] py-m32 px-m16 xl:px-0', className)}>{children}</div>
}
