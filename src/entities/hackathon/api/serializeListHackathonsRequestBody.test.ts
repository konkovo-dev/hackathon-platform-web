import { describe, it, expect } from 'vitest'
import { serializeListHackathonsRequestBody } from './serializeListHackathonsRequestBody'
import { buildQueryFromFilters } from '../model/filterMapper'
import type { operations } from '@/shared/api/platform.schema'

type ListHackathonsRequest =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']

describe('serializeListHackathonsRequestBody', () => {
  it('emits filter_groups and string_value for filter oneof (gateway JSON)', () => {
    const body: ListHackathonsRequest = buildQueryFromFilters(
      {
        stage: 'upcoming',
        formats: [],
        city: 'Москва',
        sortDirection: 'asc',
      },
      undefined,
      20
    )

    const raw = serializeListHackathonsRequestBody(body)
    const parsed = JSON.parse(raw) as Record<string, unknown>

    expect(parsed).toHaveProperty('include_description')
    expect(parsed).toHaveProperty('include_links')
    expect(parsed).toHaveProperty('include_limits')

    const query = parsed.query as Record<string, unknown>
    expect(query).toHaveProperty('filter_groups')
    expect(query).not.toHaveProperty('filterGroups')

    const groups = query.filter_groups as { filters: Record<string, unknown>[] }[]
    expect(Array.isArray(groups)).toBe(true)
    expect(groups.length).toBeGreaterThan(0)

    const filters = groups[0].filters
    const stageFilter = filters.find(f => f.field === 'stage')
    expect(stageFilter).toMatchObject({
      field: 'stage',
      operation: 'FILTER_OPERATION_EQUAL',
      string_value: 'HACKATHON_STAGE_UPCOMING',
    })

    const page = query.page as Record<string, unknown>
    expect(page).toMatchObject({ page_size: 20 })
  })
})
