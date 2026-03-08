import type {
  HackathonListFilters,
  HackathonListQuery,
  Filter,
  FilterGroup,
} from './types'

/**
 * Маппит UI-фильтры в API query для списка хакатонов
 */
export function buildQueryFromFilters(
  filters: HackathonListFilters,
  pageToken?: string,
  pageSize?: number
): HackathonListQuery {
  const filterGroups: FilterGroup[] = []

  // 1. Фильтр по стадии
  const stageFilters = mapStageFilter(filters.stage)
  if (stageFilters.length > 0) {
    filterGroups.push({ filters: stageFilters })
  }

  // 2. Фильтр по формату (online/offline)
  const formatFilters = mapFormatFilter(filters.formats)
  if (formatFilters.length > 0) {
    filterGroups.push({ filters: formatFilters })
  }

  // 3. Фильтр по городу
  if (filters.city) {
    filterGroups.push({
      filters: [
        {
          field: 'location.city',
          operation: 'FILTER_OPERATION_EQUAL',
          stringValue: filters.city,
        },
      ],
    })
  }

  return {
    query: {
      filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
      sort: [
        {
          field: 'dates.startsAt',
          direction:
            filters.sortDirection === 'asc' ? 'SORT_DIRECTION_ASC' : 'SORT_DIRECTION_DESC',
        },
      ],
    },
    includeDescription: false,
    includeLinks: false,
    includeLimits: true,
    page: pageToken || pageSize ? {
      pageToken,
      pageSize,
    } : undefined,
  }
}

/**
 * Маппит UI-стадию на API-фильтры
 * - all → все кроме DRAFT, FINISHED
 * - registration → REGISTRATION
 * - running → PRESTART, RUNNING, JUDGING
 * - finished → FINISHED
 */
function mapStageFilter(stage: HackathonListFilters['stage']): Filter[] {
  if (stage === 'all') {
    // Все кроме DRAFT и FINISHED
    return [
      {
        field: 'stage',
        operation: 'FILTER_OPERATION_IN',
        stringList: {
          values: ['UPCOMING', 'REGISTRATION', 'PRESTART', 'RUNNING', 'JUDGING'],
        },
      },
    ]
  }

  if (stage === 'registration') {
    return [
      {
        field: 'stage',
        operation: 'FILTER_OPERATION_EQUAL',
        stringValue: 'REGISTRATION',
      },
    ]
  }

  if (stage === 'running') {
    return [
      {
        field: 'stage',
        operation: 'FILTER_OPERATION_IN',
        stringList: {
          values: ['PRESTART', 'RUNNING', 'JUDGING'],
        },
      },
    ]
  }

  if (stage === 'finished') {
    return [
      {
        field: 'stage',
        operation: 'FILTER_OPERATION_EQUAL',
        stringValue: 'FINISHED',
      },
    ]
  }

  return []
}

/**
 * Маппит форматы (online/offline) на API-фильтры
 */
function mapFormatFilter(formats: HackathonListFilters['formats']): Filter[] {
  if (formats.length === 0 || formats.length === 2) {
    return []
  }

  const hasOnline = formats.includes('online')
  const hasOffline = formats.includes('offline')

  if (hasOnline && !hasOffline) {
    return [
      {
        field: 'location.online',
        operation: 'FILTER_OPERATION_EQUAL',
        boolValue: true,
      },
    ]
  }

  if (hasOffline && !hasOnline) {
    return [
      {
        field: 'location.online',
        operation: 'FILTER_OPERATION_EQUAL',
        boolValue: false,
      },
    ]
  }

  return []
}

/**
 * Дефолтные фильтры при первой загрузке
 */
export function getDefaultFilters(): HackathonListFilters {
  return {
    stage: 'all',
    formats: [],
    city: undefined,
    sortDirection: 'asc',
  }
}
