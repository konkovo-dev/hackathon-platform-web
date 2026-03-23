import { describe, it, expect } from 'vitest'
import { normalizeHackathonStage } from './types'

describe('normalizeHackathonStage', () => {
  it('maps HACKATHON_STAGE_PRE_START to PRESTART', () => {
    expect(normalizeHackathonStage('HACKATHON_STAGE_PRE_START')).toBe('PRESTART')
  })

  it('maps PRE_START to PRESTART', () => {
    expect(normalizeHackathonStage('PRE_START')).toBe('PRESTART')
  })

  it('maps HACKATHON_STAGE_UNSPECIFIED to DRAFT', () => {
    expect(normalizeHackathonStage('HACKATHON_STAGE_UNSPECIFIED')).toBe('DRAFT')
  })

  it('passes through other prefixed stages', () => {
    expect(normalizeHackathonStage('HACKATHON_STAGE_RUNNING')).toBe('RUNNING')
  })
})
