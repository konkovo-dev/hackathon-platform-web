'use client'

import { useState, useMemo } from 'react'
import { Chip, ChipList, Divider, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useLocale } from '@/shared/i18n/useLocale'
import type {
  HackathonListFilters,
  HackathonStageFilter,
  HackathonFormat,
} from '@/entities/hackathon/model/types'
import { getCities, getCityName } from '@/entities/location'
import { CitySelectModal } from './CitySelectModal'

export interface HackathonFiltersProps {
  filters: HackathonListFilters
  onFiltersChange: (filters: HackathonListFilters) => void
}

const STAGES: HackathonStageFilter[] = ['all', 'registration', 'running', 'finished']
const FORMATS: HackathonFormat[] = ['online', 'offline']

export function HackathonFilters({ filters, onFiltersChange }: HackathonFiltersProps) {
  const t = useT()
  const locale = useLocale()
  const [isCityModalOpen, setIsCityModalOpen] = useState(false)

  const cities = getCities()

  const selectedCityName = useMemo(() => {
    if (!filters.city) return null

    const city = cities.find(c => c.cityRu === filters.city)
    return city ? getCityName(city, locale) : filters.city
  }, [filters.city, cities, locale])

  const handleStageChange = (stage: HackathonStageFilter) => {
    onFiltersChange({ ...filters, stage })
  }

  const handleFormatToggle = (format: HackathonFormat) => {
    const newFormats = filters.formats.includes(format)
      ? filters.formats.filter(f => f !== format)
      : [...filters.formats, format]

    onFiltersChange({ ...filters, formats: newFormats })
  }

  const handleCitySelect = (city: string) => {
    onFiltersChange({ ...filters, city })
  }

  const handleCityClear = () => {
    onFiltersChange({ ...filters, city: undefined })
  }

  const handleSortToggle = () => {
    const newDirection = filters.sortDirection === 'asc' ? 'desc' : 'asc'
    onFiltersChange({ ...filters, sortDirection: newDirection })
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-m4">
        {/* Фильтр по стадиям */}
        <ChipList>
          {STAGES.map(stage => (
            <Chip
              key={stage}
              label={t(`hackathons.filters.stage.${stage}`)}
              variant={filters.stage === stage ? 'primary' : 'secondary'}
              onClick={() => handleStageChange(stage)}
            />
          ))}
        </ChipList>

        <Divider orientation="vertical" />

        {/* Фильтр по формату */}
        <ChipList>
          {FORMATS.map(format => {
            const isSelected = filters.formats.includes(format)
            return (
              <Chip
                key={format}
                label={t(`hackathons.filters.format.${format}`)}
                variant={isSelected ? 'primary' : 'secondary'}
                onClick={() => handleFormatToggle(format)}
              />
            )
          })}
        </ChipList>

        <Divider orientation="vertical" />

        {/* Фильтр по городу */}
        <div className="flex items-center gap-m2">
          <Chip
            label={selectedCityName || t('hackathons.filters.city.placeholder')}
            variant={filters.city ? 'primary' : 'secondary'}
            icon={<Icon src="/icons/icon-arrow/icon-arrow-down-sm.svg" size="sm" />}
            onClick={() => setIsCityModalOpen(true)}
          />
        </div>

        <Divider orientation="vertical" />

        {/* Сортировка */}
        <Chip
          label={t('hackathons.filters.sort.date')}
          variant="primary"
          icon={
            <Icon
              src={
                filters.sortDirection === 'asc'
                  ? '/icons/icon-filter/icon-filter-ascending-sm.svg'
                  : '/icons/icon-filter/icon-filter-descending-sm.svg'
              }
              size="sm"
            />
          }
          onClick={handleSortToggle}
        />
      </div>

      <CitySelectModal
        open={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSelect={handleCitySelect}
        currentCity={filters.city}
      />
    </>
  )
}
