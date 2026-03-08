#!/usr/bin/env node

/**
 * Скрипт для генерации справочника городов из REST Countries + GeoNames API
 * 
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || 'demo'
const MIN_POPULATION = 500000
const TARGET_FILE = join(__dirname, '../src/entities/location/model/cities.json')

/**
 * @typedef {Object} City
 * @property {string} country
 * @property {string} countryCode
 * @property {string} cityRu
 * @property {string} cityEn
 * @property {number} population
 * @property {string} latitude
 * @property {string} longitude
 */

/**
 * @typedef {Object} GeoNamesCity
 * @property {number} geonameId
 * @property {string} name
 * @property {string} countryCode
 * @property {number} population
 * @property {string} lat
 * @property {string} lng
 */

/**
 * @typedef {Object} RestCountry
 * @property {Object} name
 * @property {string} name.common
 * @property {string} cca2
 * @property {Object} translations
 * @property {Object} [translations.rus]
 * @property {string} [translations.rus.common]
 */

/**
 * @returns {Promise<Map<string, string>>}
 */
async function fetchRestCountries() {
  console.log('Загрузка списка стран из REST Countries API...')
  
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'hackathon-platform-cities-generator/1.0',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`REST Countries API error: ${response.status} ${response.statusText}\n${errorText}`)
    }
    
    /** @type {RestCountry[]} */
    const countries = await response.json()
    const countryMap = new Map()
    
    countries.forEach((country) => {
      const russianName = country.translations?.rus?.common || country.name.common
      countryMap.set(country.cca2, russianName)
    })
    
    console.log(`✓ Загружено ${countryMap.size} стран`)
    return countryMap
  } catch (error) {
    console.error('Ошибка при загрузке стран:', error.message)
    throw error
  }
}

/**
 * @param {string} countryCode
 * @param {string} countryName
 * @returns {Promise<City[]>}
 */
async function fetchCitiesForCountry(countryCode, countryName) {
  const urlEn = `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=${GEONAMES_USERNAME}`
  
  try {
    const responseEn = await fetch(urlEn)
    if (!responseEn.ok) {
      console.warn(`  ⚠ Ошибка загрузки городов для ${countryName}: ${responseEn.statusText}`)
      return []
    }
    
    const dataEn = await responseEn.json()
    
    if (dataEn.status) {
      console.warn(`  ⚠ GeoNames API error для ${countryName}: ${dataEn.status.message}`)
      return []
    }
    
    /** @type {GeoNamesCity[]} */
    const geonamesEn = dataEn.geonames || []
    
    const urlRu = `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&lang=ru&username=${GEONAMES_USERNAME}`
    const responseRu = await fetch(urlRu)
    let geonamesRu = []
    
    if (responseRu.ok) {
      const dataRu = await responseRu.json()
      if (!dataRu.status) {
        geonamesRu = dataRu.geonames || []
      }
    }
    
    const ruNamesMap = new Map()
    geonamesRu.forEach((city) => {
      if (city.geonameId && city.name) {
        ruNamesMap.set(city.geonameId, city.name)
      }
    })
    
    const cities = geonamesEn
      .filter((city) => city.population >= MIN_POPULATION)
      .map((city) => ({
        country: countryName,
        countryCode: countryCode,
        cityRu: ruNamesMap.get(city.geonameId) || city.name,
        cityEn: city.name,
        population: city.population,
        latitude: city.lat,
        longitude: city.lng,
      }))
    
    return cities
  } catch (error) {
    console.warn(`  ⚠ Ошибка при запросе городов для ${countryName}:`, error)
    return []
  }
}

async function generateCities() {
  console.log('\n🌍 Генерация справочника городов\n')
  
  if (GEONAMES_USERNAME === 'demo') {
    console.warn('⚠ Используется demo username для GeoNames. Для полной генерации укажите GEONAMES_USERNAME')
  }
  
  const countryMap = await fetchRestCountries()
  
  // Приоритетные страны для генерации
  const priorityCountries = [
    'RU', // Россия
    'KZ', // Казахстан
    'BY', // Беларусь
  ]
  
  /** @type {City[]} */
  const allCities = []
  
  console.log('\nЗагрузка городов по странам:')
  
  for (const countryCode of priorityCountries) {
    const countryName = countryMap.get(countryCode) || countryCode
    console.log(`  ${countryName} (${countryCode})...`)
    
    const cities = await fetchCitiesForCountry(countryCode, countryName)
    allCities.push(...cities)
    
    console.log(`    ✓ Найдено ${cities.length} городов`)
    
    await new Promise((resolve) => setTimeout(resolve, 1100))
  }
  
  const uniqueCities = Array.from(
    new Map(allCities.map((city) => [`${city.countryCode}-${city.cityRu}`, city])).values()
  )
  
  uniqueCities.sort((a, b) => b.population - a.population)
  
  console.log(`\n✓ Всего уникальных городов: ${uniqueCities.length}`)
  console.log(`✓ Топ-5 городов:`)
  uniqueCities.slice(0, 5).forEach((city, i) => {
    console.log(`  ${i + 1}. ${city.cityRu}, ${city.country} (${city.population.toLocaleString('ru-RU')} чел.)`)
  })
  
  writeFileSync(TARGET_FILE, JSON.stringify(uniqueCities, null, 2), 'utf-8')
  
  console.log(`✓ Справочник сохранен в ${TARGET_FILE}`)
  console.log('\n✨ Готово!\n')
}

generateCities().catch((error) => {
  console.error('\n❌ Ошибка генерации справочника:', error)
  process.exit(1)
})
