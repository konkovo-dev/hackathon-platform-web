'use client'

import { type ReactNode } from 'react'
import { ListItem, Icon } from '@/shared/ui'

export const SUBMISSION_FILE_DOC_ICON_SRC = '/icons/icon-doc/icon-doc-sm.svg'

export interface SubmissionFileListItemRowProps {
  filename: string
  onClick?: () => void
  rightContent?: ReactNode
}

/** Одна строка файла: как в списке посылки (bordered + иконка документа). */
export function SubmissionFileListItemRow({
  filename,
  onClick,
  rightContent,
}: SubmissionFileListItemRowProps) {
  return (
    <ListItem
      variant="bordered"
      text={filename}
      onClick={onClick}
      leftContent={<Icon src={SUBMISSION_FILE_DOC_ICON_SRC} size="sm" color="secondary" />}
      rightContent={rightContent}
    />
  )
}
