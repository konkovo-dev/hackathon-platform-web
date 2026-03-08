'use client'

import { useT } from '@/shared/i18n/useT'
import { useHackathonListQuery } from '../model/hooks'
import { HackathonCard } from './HackathonCard'
import type { HackathonListResponse } from '@/entities/hackathon/model/types'
import { ApiError } from '@/shared/api/errors'

export interface HackathonListProps {
  initialData?: HackathonListResponse
}

export function HackathonList({ initialData }: HackathonListProps) {
  const t = useT()
  const { data, isLoading, error } = useHackathonListQuery(initialData)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-m20">
        <span className="typography-body-md-regular text-text-secondary">
          {t('hackathons.list.loading')}
        </span>
      </div>
    )
  }

  if (error) {
    const isAuthError = error instanceof ApiError && error.data.status === 401
    
    return (
      <div className="flex flex-col items-center justify-center p-m20 gap-m4">
        <span className="typography-body-md-regular text-state-error">
          {t('hackathons.list.error')}
        </span>
        {isAuthError && (
          <span className="typography-body-sm-regular text-text-secondary">
            {t('hackathons.list.authRequired')}
          </span>
        )}
      </div>
    )
  }

  if (!data?.hackathons?.length) {
    return (
      <div className="flex items-center justify-center p-m20">
        <span className="typography-body-md-regular text-text-secondary">
          {t('hackathons.list.empty')}
        </span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,258px)] gap-m8 justify-center sm:justify-start">
      {data.hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.hackathonId} hackathon={hackathon} />
      ))}
    </div>
  )
}
