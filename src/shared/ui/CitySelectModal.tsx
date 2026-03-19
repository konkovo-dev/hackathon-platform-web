'use client'

import { useState, useMemo } from 'react'
import { Modal, Input, SelectList, ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { getCities, getCityName } from '@/entities/location'
import { useLocale } from '@/shared/i18n/useLocale'

/** Пустая строка означает «любой город» (сброс фильтра). */
export interface CitySelectModalProps {
  open: boolean
  onClose: () => void
  onSelect: (city: string) => void
  currentCity?: string
}

export function CitySelectModal({ open, onClose, onSelect, currentCity }: CitySelectModalProps) {
  const t = useT()
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = useState('')

  const cities = getCities()

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return cities
    }

    const lowerQuery = searchQuery.toLowerCase()
    return cities.filter(
      city =>
        city.cityRu.toLowerCase().includes(lowerQuery) ||
        city.cityEn.toLowerCase().includes(lowerQuery) ||
        city.country.toLowerCase().includes(lowerQuery)
    )
  }, [cities, searchQuery])

  const handleSelect = (cityName: string) => {
    onSelect(cityName)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t('hackathons.filters.city.modalTitle')}>
      <div className="flex flex-col gap-m6">
        <Input
          type="search"
          placeholder={t('hackathons.filters.city.search')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus
        />

        <div className="max-h-[400px] overflow-y-auto">
          <SelectList>
            <ListItem
              text={t('hackathons.filters.city.any')}
              selectable
              selected={currentCity === undefined}
              variant="bordered"
              onClick={() => handleSelect('')}
            />
            {filteredCities.map(city => {
              const cityName = getCityName(city, locale)
              const displayName = `${cityName}, ${city.country}`

              return (
                <ListItem
                  key={`${city.countryCode}-${city.cityRu}`}
                  text={displayName}
                  selectable
                  selected={currentCity === city.cityRu}
                  variant="bordered"
                  onClick={() => handleSelect(city.cityRu)}
                />
              )
            })}
          </SelectList>

          {filteredCities.length === 0 && (
            <div className="flex items-center justify-center py-m8">
              <span className="typography-body-sm-regular text-text-secondary">
                {t('hackathons.list.empty')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
