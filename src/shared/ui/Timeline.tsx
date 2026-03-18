import { cn } from '@/shared/lib/cn'

export interface TimelineStage {
  label: string
  startDate?: string
  endDate?: string
  status: 'completed' | 'current' | 'upcoming'
}

export interface TimelineProps {
  stages: TimelineStage[]
  className?: string
}

export function Timeline({ stages, className }: TimelineProps) {
  return (
    <div className={cn('flex w-full flex-nowrap items-start gap-m8', className)} role="list">
      {stages.map((stage, index) => (
        <div key={`${stage.label}-${index}`} className="flex-1 basis-0 min-w-0" role="listitem">
          <div
            className={cn(
              'typography-body-sm whitespace-nowrap',
              (stage.status === 'completed' || stage.status === 'current') && 'text-text-primary',
              stage.status === 'upcoming' && 'text-text-secondary'
            )}
          >
            {stage.label}
          </div>

          <div className="mt-m2 flex flex-col gap-m2 w-full min-w-0">
            <div
              className={cn(
                'h-px w-full',
                stage.status === 'upcoming' ? 'bg-border-default' : 'bg-brand-primary'
              )}
              aria-hidden="true"
            />

            <div className="flex w-full items-center min-w-0">
              <span
                className={cn(
                  'typography-caption-xs flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis',
                  'text-text-secondary'
                )}
              >
                {stage.startDate ?? ''}
              </span>

              <span
                className={cn(
                  'typography-caption-xs flex-1 text-right whitespace-nowrap overflow-hidden text-ellipsis',
                  'text-text-secondary'
                )}
              >
                {stage.endDate ?? ''}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
