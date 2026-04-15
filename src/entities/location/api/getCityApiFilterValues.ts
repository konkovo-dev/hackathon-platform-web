import { getCities } from './getCities'

/**
 * Значения `location.city` для запроса списка: в каталоге город хранится как `cityRu` / `cityEn`,
 * в данных хакатона в API может быть любая из форм — шлём обе как OR-группы (см. filterMapper).
 */
export function getCityApiFilterValues(selectedCity: string): string[] {
  const trimmed = selectedCity.trim()
  if (!trimmed) return []

  const cities = getCities()
  const exact = cities.find(c => c.cityRu === trimmed || c.cityEn === trimmed)
  if (exact) {
    return uniqueNonEmpty([exact.cityRu, exact.cityEn])
  }

  const lower = trimmed.toLowerCase()
  const ci = cities.find(
    c => c.cityRu.toLowerCase() === lower || c.cityEn.toLowerCase() === lower
  )
  if (ci) {
    return uniqueNonEmpty([ci.cityRu, ci.cityEn])
  }

  return [trimmed]
}

function uniqueNonEmpty(values: string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const v of values) {
    const t = v.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}
