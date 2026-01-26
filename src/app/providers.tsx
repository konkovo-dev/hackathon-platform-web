'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { I18nProvider } from '@/shared/i18n/I18nProvider'
import type { Locale } from '@/shared/i18n/config'
import type { MessagesTree } from '@/shared/i18n/types'

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
