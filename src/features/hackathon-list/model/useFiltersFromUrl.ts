'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { HackathonListFilters, HackathonFormat } from '@/entities/hackathon/model/types'
import { getDefaultFilters } from '@/entities/hackathon/model/filterMapper'
import { useGeolocation, findNearestCity } from '@/shared/lib/geolocation/useGeolocation'
import { getCities } from '@/entities/location'

/**
 * Хук для синхронизации фильтров хакатонов с URL query params
 */
export function useFiltersFromUrl(): [
  HackathonListFilters,
  (filters: HackathonListFilters) => void
] {
  const router = useRouter()
  const searchParams = useSearchParams()
  const geolocation = useGeolocation()

  const filters = useMemo(() => {
    const parsed = parseFiltersFromUrl(searchParams)
    
    if (!parsed.city) {
      const cities = getCities()
      
      if (geolocation.latitude && geolocation.longitude && !geolocation.loading) {
        const nearestCity = findNearestCity(geolocation.latitude, geolocation.longitude, cities)
        
        if (nearestCity) {
          return { ...parsed, city: nearestCity }
        }
      }
      
      if (cities.length > 0 && !geolocation.loading) {
        return { ...parsed, city: cities[0].cityRu }
      }
    }
    
    return parsed
  }, [searchParams, geolocation.latitude, geolocation.longitude, geolocation.loading])

  const setFilters = useCallback(
    (newFilters: HackathonListFilters) => {
      const params = serializeFiltersToUrl(newFilters)
      router.push(`/hackathons?${params}`, { scroll: false })
    },
    [router]
  )

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
      stage === 'all' || stage === 'registration' || stage === 'running' || stage === 'finished'
        ? stage
        : defaults.stage,
    formats: formatParam
      ? (formatParam.split(',').filter((f) => f === 'online' || f === 'offline') as HackathonFormat[])
      : defaults.formats,
    city: city || undefined,
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
  if (filters.sortDirection === 'desc') {
    params.set('sort', 'desc')
  }

  return params.toString()
}
