'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/shared/i18n/useT'
import { useCan } from '@/shared/policy/useCan'
import { useHackathonDetailQuery } from '@/features/hackathon-detail/model/hooks'
import { HackathonEditForm } from '@/features/hackathon-edit/ui/HackathonEditForm'

interface EditPageProps {
  params: {
    hackathonId: string
  }
}

export default function EditPage({ params }: EditPageProps) {
  const t = useT()
  const router = useRouter()
  const { hackathonId } = params

  const { data: hackathon, isLoading, error } = useHackathonDetailQuery(hackathonId)
  
  const { decision: canManageDecision, isLoading: isLoadingCanManage } = useCan('Hackathon.Manage', {
    hackathonId
  })
  const canManage = canManageDecision.allowed

  useEffect(() => {
    if (!isLoadingCanManage && !canManage) {
      router.push(`/hackathons/${hackathonId}`)
    }
  }, [canManage, isLoadingCanManage, hackathonId, router])

  if (isLoading || isLoadingCanManage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="typography-body-md text-text-secondary">
          {t('hackathons.list.loading')}
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="typography-body-md text-state-error">
          {t('hackathons.edit.errors.load_failed')}
        </span>
      </div>
    )
  }

  if (!hackathon || !canManage) {
    return null
  }

  return <HackathonEditForm hackathonId={hackathonId} initialData={hackathon} />
}
