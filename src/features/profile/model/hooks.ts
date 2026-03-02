'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe } from '@/entities/user/api/getMe'
import { updateMe } from '@/entities/user/api/updateMe'
import { updateMySkills } from '@/entities/user/api/updateMySkills'
import { updateMyContacts } from '@/entities/user/api/updateMyContacts'
import type { MeProfile } from '@/entities/user/model/types'
import type { UpdateMeInput } from '@/entities/user/api/updateMe'
import type { UpdateMySkillsInput } from '@/entities/user/api/updateMySkills'
import type { UpdateMyContactsInput } from '@/entities/user/api/updateMyContacts'

export const profileQueryKey = ['profile', 'me'] as const

export function useProfileQuery(initialData?: MeProfile) {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getMe,
    staleTime: 60_000,
    initialData,
  })
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateMeInput) => updateMe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  })
}

export function useUpdateSkillsMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateMySkillsInput) => updateMySkills(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  })
}

export function useUpdateContactsMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateMyContactsInput) => updateMyContacts(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  })
}
