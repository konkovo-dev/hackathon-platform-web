'use client'

import { Textarea } from '@/shared/ui/Textarea'
import { MarkdownContent } from '@/shared/ui/MarkdownContent'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n/useT'

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  rows?: number
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  rows = 6,
  className,
}: MarkdownEditorProps) {
  const t = useT()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const defaultPlaceholder = placeholder || t('common.markdown.placeholder')

  return (
    <div className={cn('grid grid-cols-2 gap-m4', className)}>
      {/* Editor */}
      <div className="flex flex-col gap-m2">
        <div className="typography-label-sm text-text-secondary">{t('common.markdown.editor')}</div>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          rows={rows}
        />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-m2">
        <div className="typography-label-sm text-text-secondary">
          {t('common.markdown.preview')}
        </div>
        <div
          className={cn(
            'min-h-[120px] border border-solid rounded-[var(--spacing-m4)] px-m4 py-m4',
            'bg-bg-surface overflow-y-auto',
            error ? 'border-state-error' : 'border-border-default'
          )}
        >
          {value ? (
            <MarkdownContent>{value}</MarkdownContent>
          ) : (
            <p className="typography-body-md-regular text-text-tertiary italic">
              {defaultPlaceholder}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
