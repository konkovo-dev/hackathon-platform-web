import { describe, it, expect } from 'vitest'
import { getStageProgress, getStageLabel } from './utils'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'

describe('getStageProgress', () => {
  it('maps DRAFT to 0', () => {
    expect(getStageProgress('DRAFT')).toBe(0)
  })

  it('maps UPCOMING to 1', () => {
    expect(getStageProgress('UPCOMING')).toBe(1)
  })

  it('maps REGISTRATION to 2', () => {
    expect(getStageProgress('REGISTRATION')).toBe(2)
  })

  it('maps PRESTART to 3', () => {
    expect(getStageProgress('PRESTART')).toBe(3)
  })

  it('maps RUNNING to 4', () => {
    expect(getStageProgress('RUNNING')).toBe(4)
  })

  it('maps JUDGING to 5', () => {
    expect(getStageProgress('JUDGING')).toBe(5)
  })

  it('maps FINISHED to 6', () => {
    expect(getStageProgress('FINISHED')).toBe(6)
  })

  it('returns 0 for unknown stage', () => {
    expect(getStageProgress('UNKNOWN' as HackathonStage)).toBe(0)
  })
})

describe('getStageLabel', () => {
  it('maps DRAFT to draft', () => {
    expect(getStageLabel('DRAFT')).toBe('draft')
  })

  it('maps UPCOMING to upcoming', () => {
    expect(getStageLabel('UPCOMING')).toBe('upcoming')
  })

  it('maps FINISHED to finished', () => {
    expect(getStageLabel('FINISHED')).toBe('finished')
  })
})
