import type { HackathonStage } from '@/entities/hackathon-context/model/types'

export type HackathonLocation = {
  city?: string
  country?: string
  online: boolean
  venue?: string
}

export type HackathonDates = {
  startsAt?: string
  endsAt?: string
  registrationOpensAt?: string
  registrationClosesAt?: string
  submissionsOpensAt?: string
  submissionsClosesAt?: string
  judgingEndsAt?: string
}

export type HackathonLimits = {
  teamSizeMax?: number
}

export type HackathonRegistrationPolicy = {
  allowIndividual: boolean
  allowTeam: boolean
}

export type HackathonLink = {
  title: string
  url: string
}

export type HackathonState = 
  | 'HACKATHON_STATE_UNSPECIFIED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ARCHIVED'

export type Hackathon = {
  hackathonId: string
  name: string
  shortDescription?: string
  description?: string
  location: HackathonLocation
  dates: HackathonDates
  limits: HackathonLimits
  registrationPolicy: HackathonRegistrationPolicy
  stage: HackathonStage
  state: HackathonState
  links?: HackathonLink[]
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  result?: string
  resultPublishedAt?: string
  task?: string
}

export type HackathonListResponse = {
  hackathons: Hackathon[]
  page: {
    hasMore: boolean
    nextPageToken: string
  }
}

export type HackathonStageFilter = 'all' | 'registration' | 'running' | 'finished'
export type HackathonFormat = 'online' | 'offline'

export type HackathonListFilters = {
  stage: HackathonStageFilter
  formats: HackathonFormat[]
  city?: string
  sortDirection: 'asc' | 'desc'
}

export type HackathonListQuery = {
  query?: {
    filterGroups?: FilterGroup[]
    sort?: Sort[]
  }
  includeDescription: boolean
  includeLinks: boolean
  includeLimits: boolean
  page?: {
    pageToken?: string
    pageSize?: number
  }
}

export type FilterGroup = {
  filters: Filter[]
}

export type Filter = {
  field: string
  operation: FilterOperation
  stringValue?: string
  boolValue?: boolean
  stringList?: StringList
}

export type FilterOperation =
  | 'FILTER_OPERATION_UNSPECIFIED'
  | 'FILTER_OPERATION_EQUAL'
  | 'FILTER_OPERATION_IN'
  | 'FILTER_OPERATION_CONTAINS'
  | 'FILTER_OPERATION_PREFIX'

export type StringList = {
  values: string[]
}

export type Sort = {
  field: string
  direction: SortDirection
}

export type SortDirection =
  | 'SORT_DIRECTION_UNSPECIFIED'
  | 'SORT_DIRECTION_ASC'
  | 'SORT_DIRECTION_DESC'
