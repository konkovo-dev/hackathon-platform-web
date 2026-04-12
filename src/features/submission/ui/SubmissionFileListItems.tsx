'use client'

import { submissionFileMetaPlain, submissionFileMetaSuffix } from '@/shared/lib/file'
import { triggerBrowserFileDownload } from '@/shared/lib/triggerBrowserFileDownload'
import { useSubmissionFileDownloadUrlMutation } from '@/entities/submission'
import type { SubmissionFile } from '@/entities/submission'
import { useT } from '@/shared/i18n/useT'
import { Button, Icon } from '@/shared/ui'
import { SubmissionFileListItemRow } from './SubmissionFileListItemRow'

/**
 * Путь к SVG-иконке скачивания в `public/`. Сейчас плейсхолдер — положите файл с тем же именем
 * или замените константу на реальный путь (например `/icons/icon-download/icon-download-sm.svg`).
 */
export const SUBMISSION_FILE_DOWNLOAD_ICON_SRC = '/icons/icon-download/icon-download-xs.svg'

export interface SubmissionFileListItemsProps {
  hackathonId: string
  submissionId: string
  files: SubmissionFile[]
  /** Подпись над списком (например i18n «файлы») */
  sectionLabel?: string
  /**
   * `edit` — «загружен • …»; клик по строке — просмотр в новой вкладке.
   * `view` — то же + справа кнопка «загрузить файл» (blob/`download`, если просмотр в новой вкладке не подошёл).
   * @default 'view'
   */
  listVariant?: 'edit' | 'view'
}

export function SubmissionFileListItems({
  hackathonId,
  submissionId,
  files,
  sectionLabel,
  listVariant = 'view',
}: SubmissionFileListItemsProps) {
  const t = useT()
  const downloadUrlMutation = useSubmissionFileDownloadUrlMutation(hackathonId)

  const resolveDownloadUrl = async (fileId: string) => {
    const res = await downloadUrlMutation.mutateAsync({
      submissionId,
      fileId,
    })
    return res.downloadUrl ?? null
  }

  /** Клик по строке: открыть presigned URL в новой вкладке (просмотр / поведение браузера по типу файла). */
  const openPreviewInNewTab = async (fileId: string) => {
    try {
      const url = await resolveDownloadUrl(fileId)
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      // silently fail
    }
  }

  /** Кнопка «скачать»: по возможности сохранить файл через blob; иначе `<a download>`. */
  const saveFileFromButton = async (fileId: string, filename: string) => {
    try {
      const url = await resolveDownloadUrl(fileId)
      if (url) await triggerBrowserFileDownload(url, filename)
    } catch {
      // silently fail
    }
  }

  if (files.length === 0) return null

  return (
    <div className="flex flex-col gap-m4">
      {sectionLabel ? (
        <span className="typography-label-md text-text-primary">{sectionLabel}</span>
      ) : null}
      <div className="flex flex-col gap-m4">
        {files.map(f => {
          const sizeNum = Number(f.sizeBytes)
          const sizeBytes = Number.isFinite(sizeNum) ? sizeNum : 0
          const meta = (
            <span className="typography-label-sm text-text-secondary shrink-0 max-w-[min(100%,20rem)] text-right">
              {listVariant === 'edit'
                ? `${t('hackathons.detail.participation.submission.fileUpload.uploaded')} ${submissionFileMetaSuffix(f.filename, sizeBytes)}`
                : submissionFileMetaPlain(f.filename, sizeBytes)}
            </span>
          )

          return (
            <SubmissionFileListItemRow
              key={f.fileId}
              filename={f.filename}
              onClick={() => void openPreviewInNewTab(f.fileId)}
              rightContent={
                <div className="flex items-center gap-m4 shrink-0">
                  {meta}
                  {listVariant === 'view' ? (
                    <div className="shrink-0" onClick={e => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="icon-secondary"
                        size="xs"
                        aria-label={t(
                          'hackathons.detail.participation.submission.fileUpload.downloadFileAriaLabel'
                        )}
                        disabled={downloadUrlMutation.isPending}
                        onClick={() => void saveFileFromButton(f.fileId, f.filename)}
                      >
                        <Icon src={SUBMISSION_FILE_DOWNLOAD_ICON_SRC} size="xs" color="secondary" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              }
            />
          )
        })}
      </div>
    </div>
  )
}
