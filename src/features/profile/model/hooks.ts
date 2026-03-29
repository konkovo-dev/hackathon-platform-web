'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe } from '@/entities/user/api/getMe'
import { pickAvatarUrlFromPayload } from '@/entities/user/api/normalizeUserAvatar'
import { createAvatarUpload, completeAvatarUpload } from '@/entities/user/api/avatarUpload'
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

export function useUploadAvatarMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const created = await createAvatarUpload({
        filename: file.name,
        contentType: file.type,
        sizeBytes: String(file.size),
      })
      const uploadUrl = created.uploadUrl
      const uploadId = created.uploadId
      if (!uploadUrl || !uploadId) {
        throw new Error('Avatar upload: missing uploadUrl or uploadId')
      }

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!putRes.ok) {
        throw new Error(`Avatar upload to storage failed: ${putRes.status}`)
      }

      return completeAvatarUpload({ uploadId })
    },
    onSuccess: data => {
      const url = pickAvatarUrlFromPayload(data)
      if (url) {
        qc.setQueryData(profileQueryKey, (old: MeProfile | undefined) => {
          if (!old?.user) return old
          return { ...old, user: { ...old.user, avatarUrl: url } }
        })
      }
      void qc.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

export type DeleteAvatarVariables = Pick<UpdateMeInput, 'firstName' | 'lastName' | 'timezone'>

export function useDeleteAvatarMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (vars: DeleteAvatarVariables) =>
      updateMe({
        firstName: vars.firstName,
        lastName: vars.lastName,
        timezone: vars.timezone,
        avatarUrl: '',
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  })
}
