import { describe, it, expect } from 'vitest'
import { buildQueryFromFilters, getDefaultFilters } from './filterMapper'
import type { HackathonListFilters } from './types'

describe('filterMapper', () => {
  describe('getDefaultFilters', () => {
    it('should return default filter values', () => {
      const filters = getDefaultFilters()

      expect(filters).toEqual({
        stage: 'all',
        formats: [],
        city: undefined,
        sortDirection: 'asc',
      })
    })
  })

  describe('buildQueryFromFilters', () => {
    it('should build query with all filters', () => {
      const filters: HackathonListFilters = {
        stage: 'registration',
        formats: ['online'],
        city: 'Москва',
        sortDirection: 'desc',
      }

      const query = buildQueryFromFilters(filters)

      expect(query.includeDescription).toBe(false)
      expect(query.includeLinks).toBe(false)
      expect(query.includeLimits).toBe(true)

      expect(query.query?.filterGroups).toHaveLength(3)
      expect(query.query?.sort).toEqual([
        { field: 'dates.startsAt', direction: 'SORT_DIRECTION_DESC' },
      ])
    })

    it('should map stage "all" to active stages excluding FINISHED', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: [],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      
      // 5 активных стадий, каждая с двумя фильтрами (state + stage)
      expect(query.query?.filterGroups).toHaveLength(5)
      
      // Проверяем каждую группу
      query.query?.filterGroups?.forEach((group, index) => {
        expect(group.filters).toHaveLength(2)
        
        // Первый фильтр должен быть state=PUBLISHED
        expect(group.filters?.[0]?.field).toBe('state')
        expect(group.filters?.[0]?.operation).toBe('FILTER_OPERATION_EQUAL')
        expect(group.filters?.[0]?.stringValue).toBe('HACKATHON_STATE_PUBLISHED')
        
        // Второй фильтр должен быть stage
        expect(group.filters?.[1]?.field).toBe('stage')
        expect(group.filters?.[1]?.operation).toBe('FILTER_OPERATION_EQUAL')
      })
      
      // Проверяем значения стадий
      const stageValues = query.query?.filterGroups?.map(
        group => group.filters?.[1]?.stringValue
      )
      
      expect(stageValues).toEqual([
        'HACKATHON_STAGE_UPCOMING',
        'HACKATHON_STAGE_REGISTRATION',
        'HACKATHON_STAGE_PRE_START',
        'HACKATHON_STAGE_RUNNING',
        'HACKATHON_STAGE_JUDGING',
      ])
    })

    it('should map stage "upcoming" to UPCOMING', () => {
      const filters: HackathonListFilters = {
        stage: 'upcoming',
        formats: [],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      
      expect(query.query?.filterGroups).toHaveLength(1)
      expect(query.query?.filterGroups?.[0]?.filters).toHaveLength(2)
      
      const stateFilter = query.query?.filterGroups?.[0]?.filters?.[0]
      expect(stateFilter?.field).toBe('state')
      expect(stateFilter?.stringValue).toBe('HACKATHON_STATE_PUBLISHED')
      
      const stageFilter = query.query?.filterGroups?.[0]?.filters?.[1]
      expect(stageFilter?.field).toBe('stage')
      expect(stageFilter?.operation).toBe('FILTER_OPERATION_EQUAL')
      expect(stageFilter?.stringValue).toBe('HACKATHON_STAGE_UPCOMING')
    })

    it('should map stage "registration" to REGISTRATION', () => {
      const filters: HackathonListFilters = {
        stage: 'registration',
        formats: [],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      
      expect(query.query?.filterGroups).toHaveLength(1)
      expect(query.query?.filterGroups?.[0]?.filters).toHaveLength(2)
      
      const stateFilter = query.query?.filterGroups?.[0]?.filters?.[0]
      expect(stateFilter?.field).toBe('state')
      
      const stageFilter = query.query?.filterGroups?.[0]?.filters?.[1]
      expect(stageFilter?.field).toBe('stage')
      expect(stageFilter?.operation).toBe('FILTER_OPERATION_EQUAL')
      expect(stageFilter?.stringValue).toBe('HACKATHON_STAGE_REGISTRATION')
    })

    it('should map stage "running" to PRESTART, RUNNING, JUDGING', () => {
      const filters: HackathonListFilters = {
        stage: 'running',
        formats: [],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)

      expect(query.query?.filterGroups).toHaveLength(3)
      
      // Каждая группа должна иметь 2 фильтра
      query.query?.filterGroups?.forEach(group => {
        expect(group.filters).toHaveLength(2)
        expect(group.filters?.[0]?.field).toBe('state')
        expect(group.filters?.[1]?.field).toBe('stage')
      })
      
      const stageValues = query.query?.filterGroups?.map(
        group => group.filters?.[1]?.stringValue
      )
      
      expect(stageValues).toEqual([
        'HACKATHON_STAGE_PRE_START',
        'HACKATHON_STAGE_RUNNING',
        'HACKATHON_STAGE_JUDGING',
      ])
    })

    it('should map stage "finished" to FINISHED', () => {
      const filters: HackathonListFilters = {
        stage: 'finished',
        formats: [],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      
      expect(query.query?.filterGroups).toHaveLength(1)
      expect(query.query?.filterGroups?.[0]?.filters).toHaveLength(2)
      
      const stateFilter = query.query?.filterGroups?.[0]?.filters?.[0]
      expect(stateFilter?.field).toBe('state')
      
      const stageFilter = query.query?.filterGroups?.[0]?.filters?.[1]
      expect(stageFilter?.field).toBe('stage')
      expect(stageFilter?.operation).toBe('FILTER_OPERATION_EQUAL')
      expect(stageFilter?.stringValue).toBe('HACKATHON_STAGE_FINISHED')
    })

    it('should filter by online format', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: ['online'],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      const formatFilter = query.query?.filterGroups?.find(group =>
        group.filters?.some(f => f.field === 'location.online')
      )?.filters?.[0]

      expect(formatFilter?.field).toBe('location.online')
      expect(formatFilter?.operation).toBe('FILTER_OPERATION_EQUAL')
      expect(formatFilter?.boolValue).toBe(true)
    })

    it('should filter by offline format', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: ['offline'],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      const formatFilter = query.query?.filterGroups?.find(group =>
        group.filters?.some(f => f.field === 'location.online')
      )?.filters?.[0]

      expect(formatFilter?.field).toBe('location.online')
      expect(formatFilter?.operation).toBe('FILTER_OPERATION_EQUAL')
      expect(formatFilter?.boolValue).toBe(false)
    })

    it('should not filter by format when both online and offline selected', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: ['online', 'offline'],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      const hasFormatFilter = query.query?.filterGroups?.some(group =>
        group.filters?.some(f => f.field === 'location.online')
      )

      expect(hasFormatFilter).toBe(false)
    })

    it('should filter by city when specified', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: [],
        city: 'Москва',
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)
      const cityFilter = query.query?.filterGroups?.find(group =>
        group.filters?.some(f => f.field === 'location.city')
      )?.filters?.[0]

      expect(cityFilter?.field).toBe('location.city')
      expect(cityFilter?.operation).toBe('FILTER_OPERATION_EQUAL')
      expect(cityFilter?.stringValue).toBe('Москва')
    })

    it('should sort ascending by default', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: [],
        sortDirection: 'asc',
      }

      const query = buildQueryFromFilters(filters)

      expect(query.query?.sort).toEqual([
        { field: 'dates.startsAt', direction: 'SORT_DIRECTION_ASC' },
      ])
    })

    it('should sort descending when specified', () => {
      const filters: HackathonListFilters = {
        stage: 'all',
        formats: [],
        sortDirection: 'desc',
      }

      const query = buildQueryFromFilters(filters)

      expect(query.query?.sort).toEqual([
        { field: 'dates.startsAt', direction: 'SORT_DIRECTION_DESC' },
      ])
    })
  })
})
