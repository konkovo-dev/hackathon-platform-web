'use client'

import { useRef } from 'react'
import { Avatar, AVATAR_PLACEHOLDER_ELEVATED } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Icon } from '@/shared/ui/Icon'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n/useT'
import { IMAGE_MIME_TYPES } from '@/shared/lib/file'

const boxClass = 'relative h-80 w-60 max-w-full overflow-hidden rounded-[var(--spacing-m4)]'

interface ProfileAvatarProps {
  avatarUrl?: string
  firstName?: string
  lastName?: string
  onUpload?: (file: File) => void
  onDelete?: () => void
  isUploading?: boolean
  className?: string
}

export function ProfileAvatar({
  avatarUrl,
  firstName,
  lastName,
  onUpload,
  onDelete,
  isUploading,
  className,
}: ProfileAvatarProps) {
  const t = useT()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editable = Boolean(onUpload || onDelete)

  const openFilePicker = () => fileInputRef.current?.click()

  const displayName = [firstName, lastName].filter(Boolean).join(' ')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file && onUpload) onUpload(file)
  }

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          boxClass,
          editable &&
            'group bg-bg-elevated hover:bg-bg-hover hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300',
        )}
      >
        {editable && onUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_MIME_TYPES.join(',')}
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={handleFileChange}
          />
        )}

        {editable && (onUpload || (onDelete && avatarUrl)) && (
          <div className="absolute top-m4 right-m4 z-20 flex items-center gap-m2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onUpload && (
              <Button
                type="button"
                variant="icon"
                size="xs"
                onClick={openFilePicker}
                disabled={isUploading}
                aria-label={t('profile.actions.upload_avatar')}
                className="border border-border-strong hover:border-border-focus"
              >
                <Icon src="/icons/icon-edit/icon-edit-xs.svg" size="xs" color="secondary" />
              </Button>
            )}
            {onDelete && avatarUrl ? (
              <Button
                type="button"
                variant="icon"
                size="xs"
                onClick={onDelete}
                disabled={isUploading}
                aria-label={t('profile.actions.delete_avatar')}
                className="border border-border-strong hover:border-border-focus"
              >
                <Icon src="/icons/icon-delete/icon-delete-xs.svg" size="xs" color="secondary" />
              </Button>
            ) : null}
          </div>
        )}

        <Avatar
          src={avatarUrl}
          name={displayName || firstName}
          size="xl"
          placeholderTone={AVATAR_PLACEHOLDER_ELEVATED}
          className="h-full w-full !aspect-auto !rounded-none border-0"
        />

        {isUploading ? (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 rounded-[inherit]"
            aria-busy
          >
            <span
              className="w-m12 h-m12 rounded-full border-2 border-text-primary border-t-transparent animate-spin"
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
