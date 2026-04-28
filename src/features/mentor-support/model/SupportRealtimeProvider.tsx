'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Centrifuge } from 'centrifuge'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { getCentrifugoWsUrl } from '@/shared/config/env'
import { getSupportRealtimeToken } from '../api'
import { applyPublicationToCache } from '../lib/applyPublicationToCache'

const SupportRealtimeConnectedContext = createContext(false)

export function useSupportRealtimeConnected(): boolean {
  return useContext(SupportRealtimeConnectedContext)
}

export interface SupportRealtimeProviderProps {
  hackathonId: string
  children: ReactNode
}

/**
 * WebSocket Centrifugo на канал `support:feed#<userId>`; при публикации инвалидирует кэш support-запросов.
 * URL: `getCentrifugoWsUrl()` — см. `env.ts` (дефолт ws://…:8000 без TLS на сокете).
 */
export function SupportRealtimeProvider({ hackathonId, children }: SupportRealtimeProviderProps) {
  const qc = useQueryClient()
  const { data: session } = useSessionQuery()
  const userId = session && session.active ? session.userId : undefined
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const wsUrl = getCentrifugoWsUrl().trim()
    if (!wsUrl || !userId) {
      setConnected(false)
      return
    }

    const centrifuge = new Centrifuge(wsUrl, {
      getToken: async () => {
        const res = await getSupportRealtimeToken(hackathonId)
        const token = res.token?.trim()
        if (!token) {
          throw new Error('support realtime: empty token')
        }
        return token
      },
    })

    const channel = `support:feed#${userId}`
    const sub = centrifuge.newSubscription(channel)

    sub.on('publication', ctx => {
      applyPublicationToCache(ctx.data, hackathonId, qc)
    })

    const onSubscribed = () => {
      setConnected(true)
      void qc.invalidateQueries({ queryKey: ['support'] })
    }
    const onUnsubscribed = () => setConnected(false)
    const onDisconnected = () => setConnected(false)

    sub.on('subscribed', onSubscribed)
    sub.on('unsubscribed', onUnsubscribed)
    centrifuge.on('disconnected', onDisconnected)

    sub.subscribe()
    centrifuge.connect()

    return () => {
      setConnected(false)
      sub.off('subscribed', onSubscribed)
      sub.off('unsubscribed', onUnsubscribed)
      centrifuge.off('disconnected', onDisconnected)
      centrifuge.removeSubscription(sub)
      centrifuge.disconnect()
    }
  }, [userId, hackathonId, qc])

  return (
    <SupportRealtimeConnectedContext.Provider value={connected}>
      {children}
    </SupportRealtimeConnectedContext.Provider>
  )
}
