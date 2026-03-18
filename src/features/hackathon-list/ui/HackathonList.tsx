'use client'

import { useT } from '@/shared/i18n/useT'
import { useInfiniteHackathonListQuery } from '../model/hooks'
import { useFiltersFromUrl } from '../model/useFiltersFromUrl'
import { HackathonCard } from './HackathonCard'
import { HackathonFilters } from './HackathonFilters'
import type { HackathonListResponse } from '@/entities/hackathon/model/types'
import { ApiError } from '@/shared/api/errors'
import { useEffect, useRef, useCallback } from 'react'
import { Button } from '@/shared/ui/Button'

export interface HackathonListProps {
  initialData?: HackathonListResponse
}

export function HackathonList({ initialData }: HackathonListProps) {
  const t = useT()
  const [filters, setFilters] = useFiltersFromUrl()
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteHackathonListQuery(filters, initialData)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  const allHackathons = data?.pages.flatMap(page => page.hackathons) ?? []

  return (
    <div className="flex flex-col gap-m8">
      <HackathonFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div className="flex items-center justify-center p-m20">
          <span className="typography-body-md-regular text-text-secondary">
            {t('hackathons.list.loading')}
          </span>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center p-m20 gap-m4">
          <span className="typography-body-md-regular text-state-error">
            {t('hackathons.list.error')}
          </span>
          {error instanceof ApiError && error.data.status === 401 && (
            <span className="typography-body-sm-regular text-text-secondary">
              {t('hackathons.list.authRequired')}
            </span>
          )}
        </div>
      )}

      {!error && !isLoading && !allHackathons.length && (
        <div className="flex items-center justify-center p-m20">
          <span className="typography-body-md-regular text-text-secondary">
            {t('hackathons.list.empty')}
          </span>
        </div>
      )}

      {!error && !isLoading && allHackathons.length > 0 && (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,258px)] gap-m8 justify-center sm:justify-start">
            {allHackathons.map(hackathon => (
              <HackathonCard key={hackathon.hackathonId} hackathon={hackathon} />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex items-center justify-center p-m8">
            {isFetchingNextPage && (
              <span className="typography-body-sm-regular text-text-secondary">
                {t('hackathons.list.loadingMore')}
              </span>
            )}
            {!hasNextPage && allHackathons.length > 0 && (
              <span className="typography-body-sm-regular text-text-tertiary">
                {t('hackathons.list.allLoaded')}
              </span>
            )}
          </div>

          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center p-m4">
              <Button variant="secondary" onClick={() => fetchNextPage()}>
                {t('hackathons.list.loadMore')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
