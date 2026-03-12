import Link from 'next/link'
import { cn } from '@/shared/lib/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-m4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-m4">
            {index > 0 && (
              <span className="typography-body-sm-regular text-text-tertiary" aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="typography-body-sm-regular text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="typography-body-sm-regular text-text-primary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
