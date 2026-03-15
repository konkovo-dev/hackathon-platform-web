import type { HackathonListFilters, HackathonListQuery, Filter, FilterGroup } from './types'

/**
 * Маппит UI-фильтры в API query для списка хакатонов
 */
export function buildQueryFromFilters(
  filters: HackathonListFilters,
  pageToken?: string,
  pageSize?: number
): HackathonListQuery {
  const filterGroups: FilterGroup[] = []

  // Фильтры по стадии с обязательным условием state=PUBLISHED
  const stageFilterGroups = mapStageFilter(filters.stage)
  filterGroups.push(...stageFilterGroups)

  // Фильтр по формату (online/offline)
  // TODO: API не поддерживает фильтрацию по формату (возвращает 500)
  // const formatFilters = mapFormatFilter(filters.formats)
  // if (formatFilters.length > 0) {
  //   filterGroups.push({ filters: formatFilters })
  // }

  // Фильтр по городу
  // TODO: API не поддерживает фильтрацию по городу 
  // if (filters.city) {
  //   filterGroups.push({
  //     filters: [
  //       {
  //         field: 'location.city',
  //         operation: 'FILTER_OPERATION_EQUAL',
  //         stringValue: filters.city,
  //       },
  //     ],
  //   })
  // }

  return {
    query: {
      filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
      sort: [
        {
          field: 'dates.startsAt',
          direction: filters.sortDirection === 'asc' ? 'SORT_DIRECTION_ASC' : 'SORT_DIRECTION_DESC',
        },
      ],
      page:
        pageToken || pageSize
          ? {
              pageToken,
              pageSize,
            }
          : undefined,
    },
    includeDescription: false,
    includeLinks: false,
    includeLimits: true,
  }
}

/**
 * Маппит UI-стадию на API-фильтры
 * Каждая группа включает условие state=PUBLISHED для фильтрации черновиков
 * - all → все активные стадии (UPCOMING, REGISTRATION, PRESTART, RUNNING, JUDGING)
 * - upcoming → UPCOMING (анонсы)
 * - registration → REGISTRATION
 * - running → PRESTART, RUNNING, JUDGING
 * - finished → FINISHED
 */
function mapStageFilter(stage: HackathonListFilters['stage']): FilterGroup[] {
  const publishedStateFilter: Filter = {
    field: 'state',
    operation: 'FILTER_OPERATION_EQUAL',
    stringValue: 'HACKATHON_STATE_PUBLISHED',
  }

  if (stage === 'all') {
    return [
      'HACKATHON_STAGE_UPCOMING',
      'HACKATHON_STAGE_REGISTRATION',
      'HACKATHON_STAGE_PRE_START',
      'HACKATHON_STAGE_RUNNING',
      'HACKATHON_STAGE_JUDGING',
    ].map(stageValue => ({
      filters: [
        publishedStateFilter,
        {
          field: 'stage',
          operation: 'FILTER_OPERATION_EQUAL',
          stringValue: stageValue,
        },
      ],
    }))
  }

  if (stage === 'upcoming') {
    return [
      {
        filters: [
          publishedStateFilter,
          {
            field: 'stage',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: 'HACKATHON_STAGE_UPCOMING',
          },
        ],
      },
    ]
  }

  if (stage === 'registration') {
    return [
      {
        filters: [
          publishedStateFilter,
          {
            field: 'stage',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: 'HACKATHON_STAGE_REGISTRATION',
          },
        ],
      },
    ]
  }

  if (stage === 'running') {
    return [
      'HACKATHON_STAGE_PRE_START',
      'HACKATHON_STAGE_RUNNING',
      'HACKATHON_STAGE_JUDGING',
    ].map(stageValue => ({
      filters: [
        publishedStateFilter,
        {
          field: 'stage',
          operation: 'FILTER_OPERATION_EQUAL',
          stringValue: stageValue,
        },
      ],
    }))
  }

  if (stage === 'finished') {
    return [
      {
        filters: [
          publishedStateFilter,
          {
            field: 'stage',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: 'HACKATHON_STAGE_FINISHED',
          },
        ],
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
