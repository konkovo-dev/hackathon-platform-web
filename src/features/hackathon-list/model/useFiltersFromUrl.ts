'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { HackathonListFilters, HackathonFormat } from '@/entities/hackathon/model/types'
import { getDefaultFilters } from '@/entities/hackathon/model/filterMapper'
import { useGeolocation, findNearestCity } from '@/shared/lib/geolocation/useGeolocation'
import { getCities } from '@/entities/location'

function filtersEqual(a: HackathonListFilters, b: HackathonListFilters): boolean {
  if (a.stage !== b.stage || a.city !== b.city || a.sortDirection !== b.sortDirection) return false
  if (a.formats.length !== b.formats.length) return false
  return a.formats.every((f, i) => b.formats[i] === f)
}

/**
 * Хук для синхронизации фильтров хакатонов с URL query params.
 * При смене фильтров сразу выставляет «ожидающие» фильтры, чтобы список обновился до обновления URL.
 */
export function useFiltersFromUrl(): [
  HackathonListFilters,
  (filters: HackathonListFilters) => void,
] {
  const router = useRouter()
  const searchParams = useSearchParams()
  const geolocation = useGeolocation()
  const [pendingFilters, setPendingFilters] = useState<HackathonListFilters | null>(null)
  const citySyncDoneRef = useRef(false)

  const filtersFromUrl = useMemo(() => {
    const parsed = parseFiltersFromUrl(searchParams)

    const hasCityInUrl = searchParams.has('city')
    const hasAnyFilterInUrl = searchParams.toString().length > 0

    if (!parsed.city && !hasCityInUrl && !hasAnyFilterInUrl) {
      const cities = getCities()

      if (cities.length > 0) {
        if (geolocation.latitude && geolocation.longitude && !geolocation.loading) {
          const nearestCity = findNearestCity(geolocation.latitude, geolocation.longitude, cities)

          if (nearestCity) {
            return { ...parsed, city: nearestCity }
          }
        }

        return { ...parsed, city: cities[0].cityRu }
      }
    }

    return parsed
  }, [searchParams, geolocation.latitude, geolocation.longitude, geolocation.loading])

  const filters = pendingFilters ?? filtersFromUrl

  useEffect(() => {
    if (!pendingFilters) return
    if (filtersEqual(pendingFilters, filtersFromUrl)) {
      setPendingFilters(null)
    }
  }, [pendingFilters, filtersFromUrl])

  const setFilters = useCallback(
    (newFilters: HackathonListFilters) => {
      setPendingFilters(newFilters)
      const params = serializeFiltersToUrl(newFilters)
      router.replace(`/hackathons?${params}`, { scroll: false })
    },
    [router]
  )

  useEffect(() => {
    if (pendingFilters || citySyncDoneRef.current) return
    if (!filtersFromUrl.city || searchParams.has('city')) return
    if (searchParams.toString().length > 0) return
    citySyncDoneRef.current = true
    const params = serializeFiltersToUrl(filtersFromUrl)
    router.replace(`/hackathons?${params}`, { scroll: false })
  }, [pendingFilters, filtersFromUrl.city, searchParams, router])

  return [filters, setFilters]
}

/**
 * Парсит фильтры из URL query params
 */
function parseFiltersFromUrl(searchParams: URLSearchParams): HackathonListFilters {
  const defaults = getDefaultFilters()

  const stage = searchParams.get('stage')
  const formatParam = searchParams.get('format')
  const city = searchParams.get('city')
  const sort = searchParams.get('sort')

  return {
    stage:
      stage === 'all' ||
      stage === 'upcoming' ||
      stage === 'registration' ||
      stage === 'running' ||
      stage === 'finished'
        ? stage
        : defaults.stage,
    formats: formatParam
      ? (formatParam.split(',').filter(f => f === 'online' || f === 'offline') as HackathonFormat[])
      : defaults.formats,
    city: city ? city : undefined,
    sortDirection: sort === 'desc' ? 'desc' : 'asc',
  }
}

/**
 * Сериализует фильтры в URL query params
 */
function serializeFiltersToUrl(filters: HackathonListFilters): string {
  const params = new URLSearchParams()

  // Стадия
  if (filters.stage !== 'all') {
    params.set('stage', filters.stage)
  }

  // Форматы
  if (filters.formats.length > 0) {
    params.set('format', filters.formats.join(','))
  }

  // Город
  if (filters.city) {
    params.set('city', filters.city)
  }

  // Сортировка
  params.set('sort', filters.sortDirection)

  return params.toString()
}
