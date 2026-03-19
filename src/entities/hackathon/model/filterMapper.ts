import type { HackathonListFilters, HackathonListQuery, Filter, FilterGroup } from './types'

/**
 * Маппит UI-фильтры в API query для списка хакатонов.
 * Логика: внутри одной filter group все условия объединяются через AND,
 * между группами — через OR (используется только для стадии "all" / "running").
 */
export function buildQueryFromFilters(
  filters: HackathonListFilters,
  pageToken?: string,
  pageSize?: number
): HackathonListQuery {
  const additionalFilters = collectAdditionalFilters(filters)

  let filterGroups: FilterGroup[] = []

  if (!filters.skipStageFilter) {
    const stageFilterGroups = mapStageFilter(filters.stage)
    filterGroups = stageFilterGroups.map(group => ({
      filters: [...(group.filters ?? []), ...additionalFilters],
    }))
  } else if (additionalFilters.length > 0) {
    filterGroups = [
      {
        filters: [
          {
            field: 'state',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: 'HACKATHON_STATE_PUBLISHED',
          },
          ...additionalFilters,
        ],
      },
    ]
  }

  return {
    query: {
      filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
      q: filters.searchQuery,
      sort: [
        {
          field: 'starts_at',
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
 * Собирает фильтры формата (online/offline) и города в один массив.
 * Эти условия добавляются в каждую группу (AND внутри группы).
 */
function collectAdditionalFilters(filters: HackathonListFilters): Filter[] {
  const result: Filter[] = []

  const formatFilters = mapFormatFilter(filters.formats)
  result.push(...formatFilters)

  if (filters.city) {
    result.push({
      field: 'location.city',
      operation: 'FILTER_OPERATION_EQUAL',
      stringValue: filters.city,
    })
  }

  return result
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
    return ['HACKATHON_STAGE_PRE_START', 'HACKATHON_STAGE_RUNNING', 'HACKATHON_STAGE_JUDGING'].map(
      stageValue => ({
        filters: [
          publishedStateFilter,
          {
            field: 'stage',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: stageValue,
          },
        ],
      })
    )
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
    sortDirection: 'desc',
  }
}
