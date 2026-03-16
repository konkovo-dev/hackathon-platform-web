'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { I18nProvider } from '@/shared/i18n/I18nProvider'
import { ApiError } from '@/shared/api/errors'
import { getLoginUrl, isPublicRoute } from '@/shared/config/routes'
import type { Locale } from '@/shared/i18n/config'
import type { MessagesTree } from '@/shared/i18n/types'

let isNavigatingAfterAuth = false

export function setNavigatingAfterAuth() {
  isNavigatingAfterAuth = true
  setTimeout(() => {
    isNavigatingAfterAuth = false
  }, 1000)
}

export function resetNavigatingAfterAuth() {
  isNavigatingAfterAuth = false
}

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode
  locale: Locale
  messages: MessagesTree
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 секунд
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error: Error) => {
            handleGlobalError(error)
          },
        }),
        queryCache: new QueryCache({
          onError: (error: Error) => {
            handleGlobalError(error)
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={locale} messages={messages}>
        {children}
      </I18nProvider>
    </QueryClientProvider>
  )
}

function handleGlobalError(error: unknown) {
  if (error instanceof ApiError) {
    const code = error.data?.code
    const status = error.data?.status
    const url = error.data?.url
    
    // 401 Unauthorized или gRPC Unauthenticated (16)
    if (status === 401 || code === '16' || code === 'UNAUTHENTICATED') {
      if (isNavigatingAfterAuth) {
        return
      }

      if (url && isResourceAccessDenied(url)) {
        return
      }
      
      const currentPath = window.location.pathname
      
      if (!isPublicRoute(currentPath)) {
        window.location.href = getLoginUrl(currentPath)
      }
    }
  }
}

/**
 * Проверяет, является ли 401 результатом отсутствия прав доступа к ресурсу
 * (а не истечения сессии)
 */
function isResourceAccessDenied(url: string): boolean {
  if (url.includes('/v1/hackathons/') && url.match(/\/v1\/hackathons\/[a-f0-9-]+/)) {
    return true
  }
  
  if (url.includes('/participations/')) {
    return true
  }
  
  if (url.includes('/v1/teams/')) {
    return true
  }
  
  return false
}
