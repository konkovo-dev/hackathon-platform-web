import type { components, operations } from '@/shared/api/platform.schema'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'

// Базовые типы из OpenAPI
export type HackathonLocation = components['schemas']['v1HackathonLocation']
export type HackathonDates = components['schemas']['v1HackathonDates']
export type HackathonLimits = components['schemas']['v1HackathonLimits']
export type HackathonRegistrationPolicy = components['schemas']['v1HackathonRegistrationPolicy']
export type HackathonLink = components['schemas']['v1HackathonLink']
export type HackathonState = components['schemas']['v1HackathonState']

// Основной тип Hackathon с кастомным stage
type HackathonFromAPI = components['schemas']['v1Hackathon']

export type Hackathon = Omit<HackathonFromAPI, 'stage'> & {
  stage: HackathonStage
}

// Типы для списка хакатонов
export type HackathonListResponse =
  operations['HackathonService_ListHackathons']['responses']['200']['content']['application/json'] & {
    hackathons: Hackathon[]
  }

// Типы для фильтрации (клиентские)
export type HackathonStageFilter = 'all' | 'upcoming' | 'registration' | 'running' | 'finished'
export type HackathonFormat = 'online' | 'offline'

export type HackathonListFilters = {
  stage: HackathonStageFilter
  formats: HackathonFormat[]
  city?: string
  sortDirection: 'asc' | 'desc'
  searchQuery?: string
  skipStageFilter?: boolean
}

// Типы для Query (из OpenAPI)
export type HackathonListQuery =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']

export type FilterGroup = components['schemas']['v1FilterGroup']
export type Filter = components['schemas']['v1Filter']
export type FilterOperation = components['schemas']['v1FilterOperation']
export type StringList = components['schemas']['v1StringList']
export type Sort = components['schemas']['v1Sort']
export type SortDirection = components['schemas']['v1SortDirection']

// Типы для дашборда
export type RoleFilter = 'owner' | 'organizer' | 'judge' | 'mentor'
export type DashboardRole = 'organizer' | 'jury' | 'mentor' | 'participant'
