import type { City } from '../model/types'
import citiesData from '../model/cities.json'

export function getCities(): City[] {
  return citiesData as City[]
}

export function searchCities(query: string): City[] {
  if (!query.trim()) {
    return getCities()
  }

  const lowerQuery = query.toLowerCase()
  return getCities().filter(
    (city) =>
      city.cityRu.toLowerCase().includes(lowerQuery) ||
      city.cityEn.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  )
}

export function getUniqueCountries(): string[] {
  const countries = new Set<string>()
  getCities().forEach((city) => countries.add(city.country))
  return Array.from(countries).sort()
}
