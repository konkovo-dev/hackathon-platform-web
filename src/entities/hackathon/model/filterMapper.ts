import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import { getCityApiFilterValues } from '@/entities/location'
import type { HackathonListFilters, HackathonListQuery, Filter, FilterGroup } from './types'

/**
 * Маппит UI-фильтры в API query для списка хакатонов.
 *
 * **Группы:** внутри одной `filterGroup` все `filters` — AND; между группами — OR.
 *
 * **Стадии «все активные» / «идёт хакатон»:** несколько стадий задаются несколькими OR-группами.
 * Формат (`collectFormatFilters`) **обязательно копируется в каждую** такую группу
 * (см. `expandFilterGroupsByCityVariants`), иначе получилось бы `(стадия₁) ∨ … ∨ (офлайн)` без города.
 *
 * **Город:** для записей из каталога с двумя названиями (`cityRu` / `cityEn`) строим
 * `(… ∧ город=RU) ∨ (… ∧ город=EN)`, иначе в БД «Moscow» не попадает при фильтре «Москва».
 */
export function buildQueryFromFilters(
  filters: HackathonListFilters,
  pageToken?: string,
  pageSize?: number
): HackathonListQuery {
  const stageKey = filters.stage ?? getDefaultFilters().stage
  const filtersWithStage: HackathonListFilters = { ...filters, stage: stageKey }

  const formatFilters = collectFormatFilters(filtersWithStage)
  const cityVariants = filtersWithStage.city?.trim()
    ? getCityApiFilterValues(filtersWithStage.city)
    : []

  let filterGroups: FilterGroup[] = []

  if (!filtersWithStage.skipStageFilter) {
    const stageFilterGroups = mapStageFilter(stageKey)
    filterGroups = expandFilterGroupsByCityVariants(stageFilterGroups, formatFilters, cityVariants)
  } else if (formatFilters.length > 0 || cityVariants.length > 0) {
    const published: Filter = {
      field: 'state',
      operation: 'FILTER_OPERATION_EQUAL',
      stringValue: 'HACKATHON_STATE_PUBLISHED',
    }
    if (cityVariants.length === 0) {
      filterGroups = [{ filters: [published, ...formatFilters] }]
    } else {
      filterGroups = cityVariants.map(city => ({
        filters: [
          published,
          ...formatFilters,
          {
            field: 'location.city',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: city,
          },
        ],
      }))
    }
  }

  return {
    query: {
      filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
      q: filtersWithStage.searchQuery,
      sort: [
        {
          field: 'starts_at',
          direction:
            filtersWithStage.sortDirection === 'asc' ? 'SORT_DIRECTION_ASC' : 'SORT_DIRECTION_DESC',
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

function collectFormatFilters(filters: HackathonListFilters): Filter[] {
  return mapFormatFilter(filters.formats)
}

/**
 * К каждой стадийной OR-ветке добавляет формат; при нескольких вариантах города (RU/EN каталога)
 * дублирует ветки: `(стадия ∧ формат ∧ city₁) ∨ (стадия ∧ формат ∧ city₂)`.
 */
function expandFilterGroupsByCityVariants(
  groups: FilterGroup[],
  formatFilters: Filter[],
  cityVariants: string[]
): FilterGroup[] {
  if (cityVariants.length === 0) {
    return groups.map(group => ({
      filters: [...(group.filters ?? []), ...formatFilters],
    }))
  }

  return groups.flatMap(group => {
    const base = [...(group.filters ?? []), ...formatFilters]
    return cityVariants.map(city => ({
      filters: [
        ...base,
        {
          field: 'location.city',
          operation: 'FILTER_OPERATION_EQUAL',
          stringValue: city,
        },
      ],
    }))
  })
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

/** Соответствие нормализованной стадии хакатона выбранному фильтру каталога (после normalizeHackathonStage). */
export function hackathonStageMatchesListFilter(
  normalizedStage: HackathonStage,
  filterStage: HackathonListFilters['stage']
): boolean {
  switch (filterStage) {
    case 'all':
      return normalizedStage !== 'FINISHED' && normalizedStage !== 'DRAFT'
    case 'upcoming':
      return normalizedStage === 'UPCOMING'
    case 'registration':
      return normalizedStage === 'REGISTRATION'
    case 'running':
      return (
        normalizedStage === 'PRESTART' ||
        normalizedStage === 'RUNNING' ||
        normalizedStage === 'JUDGING'
      )
    case 'finished':
      return normalizedStage === 'FINISHED'
    default:
      return true
  }
}
