import { Chip } from '@/shared/ui/Chip'
import { ChipList } from '@/shared/ui/ChipList'
import { getSkillName, type Skill } from '@/entities/user/model/types'
import type { ReactNode } from 'react'

interface ProfileSkillsSectionProps {
  skills: Skill[]
  emptyState?: ReactNode
}

export function ProfileSkillsSection({ skills, emptyState }: ProfileSkillsSectionProps) {
  if (skills.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  if (skills.length === 0) {
    return null
  }

  return (
    <ChipList>
      {skills.map(skill => {
        const name = getSkillName(skill)
        return <Chip key={name} label={name} />
      })}
    </ChipList>
  )
}
