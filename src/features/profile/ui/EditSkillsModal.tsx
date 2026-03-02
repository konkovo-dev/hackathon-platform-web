'use client'

import { useState, useMemo, useEffect } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { ChipList } from '@/shared/ui/ChipList'
import { Input } from '@/shared/ui/Input'
import { SelectListItem } from '@/shared/ui/SelectListItem'
import { SelectList } from '@/shared/ui/SelectList'
import { SwitchField } from '@/shared/ui/SwitchField'
import { useT } from '@/shared/i18n/useT'
import type { Skill, VisibilityLevel } from '@/entities/user/model/types'
import { getSkillName } from '@/entities/user/model/types'
import { useSkillCatalogQuery } from '@/entities/skill/model/hooks'

interface EditSkillsModalProps {
  open: boolean
  onClose: () => void
  skills: Skill[]
  skillsVisibility: VisibilityLevel
  onSave: (skills: string[], visibility: VisibilityLevel) => Promise<void>
  isPending: boolean
}

export function EditSkillsModal({
  open,
  onClose,
  skills,
  skillsVisibility,
  onSave,
  isPending,
}: EditSkillsModalProps) {
  const t = useT()

  const [draft, setDraft] = useState<string[]>(() => skills.map(getSkillName).filter(Boolean))
  const [visibility, setVisibility] = useState<VisibilityLevel>(skillsVisibility)
  const [search, setSearch] = useState('')

  const { data: catalogData } = useSkillCatalogQuery()
  const catalogSkills = useMemo(
    () => catalogData?.skills?.map((s) => s.name).filter((name): name is string => Boolean(name)) ?? [],
    [catalogData]
  )

  useEffect(() => {
    if (open) {
      setDraft(skills.map(getSkillName).filter(Boolean))
      setVisibility(skillsVisibility)
      setSearch('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return catalogSkills
    return catalogSkills.filter((s) => s.toLowerCase().includes(q))
  }, [search, catalogSkills])

  const addSkill = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || draft.includes(trimmed) || !catalogSkills.includes(trimmed)) return
    setDraft((prev) => [...prev, trimmed])
    setSearch('')
  }

  const removeSkill = (name: string) => {
    setDraft((prev) => prev.filter((s) => s !== name))
  }

  const toggleSkill = (name: string) => {
    if (draft.includes(name)) {
      removeSkill(name)
    } else {
      addSkill(name)
    }
  }

  const handleSave = async () => {
    await onSave(draft, visibility)
  }

  return (
    <Modal open={open} onClose={onClose} title={t('profile.edit.skills_title')}>
      {draft.length > 0 && (
        <>
          <ChipList>
            {draft.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onRemove={() => removeSkill(skill)}
              />
            ))}
          </ChipList>
          <div className="h-px bg-divider" />
        </>
      )}

      <Input
        variant="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('profile.edit.skills_search')}
      />

      {filteredSkills.length > 0 ? (
        <div className="flex-1 overflow-y-auto min-h-0 -mx-m8 px-m8">
          <SelectList>
            {filteredSkills.map((skill) => {
              const isSelected = draft.includes(skill)
              return (
                <SelectListItem
                  key={skill}
                  label={skill}
                  selected={isSelected}
                  onClick={() => toggleSkill(skill)}
                />
              )
            })}
          </SelectList>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <SwitchField
        checked={visibility === 'VISIBILITY_LEVEL_PUBLIC'}
        onChange={(checked) =>
          setVisibility(checked ? 'VISIBILITY_LEVEL_PUBLIC' : 'VISIBILITY_LEVEL_PRIVATE')
        }
        label={t('profile.visibility.skills_label')}
      />

      <div className="flex justify-end gap-m4 pt-m4">
        <Button variant="action" size="sm" onClick={handleSave} disabled={isPending}>
          {t('profile.actions.save')}
        </Button>
      </div>
    </Modal>
  )
}
