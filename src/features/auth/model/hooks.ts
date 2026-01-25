'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/entities/auth/api/authApi'
import type { components as AuthBffComponents } from '@/shared/api/authBff.schema'

type LoginRequest = AuthBffComponents['schemas']['BffLoginRequest']
type RegisterRequest = AuthBffComponents['schemas']['BffRegisterRequest']

const sessionKey = ['auth', 'session'] as const

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionKey,
    queryFn: () => authApi.session(),
    staleTime: 15_000,
  })
}

export function useLoginMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: LoginRequest) => authApi.login(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sessionKey })
    },
  })
}

export function useRegisterMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: RegisterRequest) => authApi.register(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sessionKey })
    },
  })
}

export function useLogoutMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sessionKey })
    },
  })
}
