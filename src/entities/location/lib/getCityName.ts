import type { City } from '../model/types'

/**
 * Возвращает локализованное название города
 */
export function getCityName(city: City, locale: 'ru' | 'en' = 'ru'): string {
  return locale === 'ru' ? city.cityRu : city.cityEn
}
