'use client'

import { useMemo } from 'react'
import { useProfileQuery } from '@/features/profile/model/hooks'
import { pickAvatarUrlFromPayload } from '@/entities/user/api/normalizeUserAvatar'
import { toAvatarImgSrc } from '@/shared/lib/avatarUrl'

export type SupportViewerOutgoingMeta = {
  displayName: string
  avatarSrc: string | null
}

/**
 * Имя и аватар текущего пользователя для исходящих сообщений в чате поддержки.
 */
export function useSupportViewerOutgoingMeta(): SupportViewerOutgoingMeta {
  const { data } = useProfileQuery()

  return useMemo(() => {
    const u = data?.user
    const displayName =
      [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() || u?.username?.trim() || ''
    const raw = u ? pickAvatarUrlFromPayload(u) : undefined
    const avatarSrc = raw ? toAvatarImgSrc(raw) : null
    return { displayName, avatarSrc }
  }, [data])
}
