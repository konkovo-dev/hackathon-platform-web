import { cn } from '@/shared/lib/cn'

export interface IconCompletionProps {
  progress: 0 | 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export function IconCompletion({ progress, className }: IconCompletionProps) {
  const circumference = 2 * Math.PI * 9
  const progressPercentage = progress / 6
  const strokeDashoffset = circumference * (1 - progressPercentage)

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('flex-shrink-0', className)}
      aria-label={`Progress ${progress} out of 6`}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="hsl(var(--color-bg-hover))"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
        className="text-brand-primary transition-all duration-300"
      />
    </svg>
  )
}
