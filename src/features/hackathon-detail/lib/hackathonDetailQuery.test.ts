import { describe, it, expect } from 'vitest'
import { hackathonDetailPath } from '@/shared/config/routes'
import {
  parseHackathonDetailSearchParams,
  serializeHackathonDetailUrlFromProps,
} from './hackathonDetailQuery'

describe('hackathonDetailPath', () => {
  it('uses bare path for about + description', () => {
    expect(hackathonDetailPath('abc')).toBe('/hackathons/abc')
    expect(hackathonDetailPath('abc', { tab: 'about', section: 'description' })).toBe(
      '/hackathons/abc'
    )
  })

  it('adds section for about + task', () => {
    expect(hackathonDetailPath('abc', { tab: 'about', section: 'task' })).toBe(
      '/hackathons/abc?tab=about&section=task'
    )
  })

  it('adds only tab for management overview', () => {
    expect(hackathonDetailPath('abc', { tab: 'management' })).toBe('/hackathons/abc?tab=management')
  })

  it('adds org for management participants', () => {
    expect(hackathonDetailPath('abc', { tab: 'management', org: 'participants' })).toBe(
      '/hackathons/abc?tab=management&org=participants'
    )
  })
})

describe('parseHackathonDetailSearchParams', () => {
  it('maps legacy description tab to about', () => {
    const sp = new URLSearchParams([['tab', 'description']])
    const { state, replaceHref } = parseHackathonDetailSearchParams('x', sp)
    expect(state.tab).toBe('about')
    expect(state.section).toBe('description')
    expect(replaceHref).toBe('/hackathons/x')
  })

  it('maps participants tab to management org', () => {
    const sp = new URLSearchParams([['tab', 'participants']])
    const { state, replaceHref } = parseHackathonDetailSearchParams('x', sp)
    expect(state.tab).toBe('management')
    expect(state.org).toBe('participants')
    expect(replaceHref).toBe('/hackathons/x?tab=management&org=participants')
  })
})

describe('serializeHackathonDetailUrlFromProps', () => {
  it('serializes props to path', () => {
    expect(serializeHackathonDetailUrlFromProps('x', 'judging', null, null)).toBe(
      '/hackathons/x?tab=judging'
    )
  })
})
