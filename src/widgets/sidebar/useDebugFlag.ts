'use client'

import { useCallback, useEffect, useState } from 'react'

type UseDebugFlagOptions = {
  cookieName?: string
  localStorageKey?: string
}

const getCookieValue = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${name}=`))
    ?.split('=')[1]
}

export function useDebugFlag(options: UseDebugFlagOptions = {}) {
  const cookieName = options.cookieName ?? 'hp_debug'
  const localStorageKey = options.localStorageKey ?? cookieName

  const [debug, setDebugState] = useState(false)

  useEffect(() => {
    try {
      const cookieValue = getCookieValue(cookieName)
      if (cookieValue === '1' || cookieValue === '0') {
        setDebugState(cookieValue === '1')
        return
      }

      const raw = localStorage.getItem(localStorageKey)
      setDebugState(raw === '1')
    } catch {
      // ignore
    }
  }, [cookieName, localStorageKey])

  const setDebug = useCallback(
    (next: boolean) => {
      setDebugState(next)
      try {
        const maxAge = 60 * 60 * 24 * 365
        document.cookie = `${cookieName}=${next ? '1' : '0'}; path=/; max-age=${maxAge}`
        localStorage.setItem(localStorageKey, next ? '1' : '0')
      } catch {
        // ignore
      }
    },
    [cookieName, localStorageKey]
  )

  return { debug, setDebug }
}
