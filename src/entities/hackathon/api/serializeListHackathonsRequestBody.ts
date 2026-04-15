import type { operations } from '@/shared/api/platform.schema'
import type { components } from '@/shared/api/platform.schema'

type ListHackathonsRequest =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']
type V1Filter = components['schemas']['v1Filter']
type V1FilterGroup = components['schemas']['v1FilterGroup']

/**
 * Тело POST /v1/hackathons/list для gRPC-gateway.
 * - Поля `query`: `filter_groups`, `page_size`, `page_token` — в Go у `Query`/`PageRequest` json-теги snake_case.
 * - Поля значения фильтра (oneof): в интеграционных тестах API для JSON используется snake_case (`string_value`, …), как в теле к `POST /v1/hackathons/list`.
 */
export function serializeListHackathonsRequestBody(body: ListHackathonsRequest): string {
  return JSON.stringify(listHackathonsRequestToWire(body))
}

function listHackathonsRequestToWire(body: ListHackathonsRequest): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (body.includeDescription !== undefined) {
    out.include_description = body.includeDescription
  }
  if (body.includeLinks !== undefined) {
    out.include_links = body.includeLinks
  }
  if (body.includeLimits !== undefined) {
    out.include_limits = body.includeLimits
  }
  if (body.query) {
    out.query = queryToWire(body.query)
  }
  return out
}

function queryToWire(
  query: NonNullable<ListHackathonsRequest['query']>
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (query.q) {
    out.q = query.q
  }
  if (query.filterGroups && query.filterGroups.length > 0) {
    out.filter_groups = query.filterGroups.map(filterGroupToWire)
  }
  if (query.sort && query.sort.length > 0) {
    out.sort = query.sort.map(s => ({
      field: s.field,
      direction: s.direction,
    }))
  }
  if (query.page && (query.page.pageSize != null || query.page.pageToken)) {
    const page: Record<string, unknown> = {}
    if (query.page.pageSize != null) {
      page.page_size = query.page.pageSize
    }
    if (query.page.pageToken) {
      page.page_token = query.page.pageToken
    }
    out.page = page
  }
  return out
}

function filterGroupToWire(group: V1FilterGroup): Record<string, unknown> {
  return {
    filters: (group.filters ?? []).map(filterToWire),
  }
}

function filterToWire(f: V1Filter): Record<string, unknown> {
  const out: Record<string, unknown> = {
    field: f.field,
    operation: f.operation,
  }
  if (f.stringValue !== undefined) {
    out.string_value = f.stringValue
  }
  if (f.boolValue !== undefined) {
    out.bool_value = f.boolValue
  }
  if (f.int64Value !== undefined) {
    out.int64_value = f.int64Value
  }
  if (f.stringList?.values && f.stringList.values.length > 0) {
    out.string_list = { values: f.stringList.values }
  }
  return out
}
