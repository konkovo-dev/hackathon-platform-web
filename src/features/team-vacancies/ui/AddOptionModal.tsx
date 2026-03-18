'use client'

import { useState, useMemo } from 'react'
import { Modal, Button, Input, ListItem, SelectList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'

export interface AddOptionModalProps {
  open: boolean
  onClose: () => void
  title: string
  searchPlaceholder: string
  items: { id: string; name: string }[]
  excludeIds?: string[]
  onConfirm: (ids: string[]) => void
}

export function AddOptionModal({
  open,
  onClose,
  title,
  searchPlaceholder,
  items,
  excludeIds = [],
  onConfirm,
}: AddOptionModalProps) {
  const t = useT()
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const availableItems = useMemo(
    () => items.filter(item => !excludeIds.includes(item.id)),
    [items, excludeIds]
  )

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return availableItems
    return availableItems.filter(item => item.name.toLowerCase().includes(q))
  }, [search, availableItems])

  const handleConfirm = () => {
    if (selectedIds.length > 0) {
      onConfirm(selectedIds)
      setSelectedIds([])
      setSearch('')
    }
    onClose()
  }

  const handleClose = () => {
    setSelectedIds([])
    setSearch('')
    onClose()
  }

  const toggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} size="md">
      <div className="flex flex-col gap-m4">
        <Input
          variant="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
        />
        {filteredItems.length > 0 ? (
          <div className="max-h-[280px] overflow-y-auto -mx-m8 px-m8">
            <SelectList>
              {filteredItems.map(item => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <ListItem
                    key={item.id}
                    text={item.name}
                    selectable
                    selected={isSelected}
                    variant="bordered"
                    onClick={() => toggle(item.id)}
                  />
                )
              })}
            </SelectList>
          </div>
        ) : null}
        <div className="flex justify-end gap-m4 pt-m2">
          <Button variant="secondary" size="md" onClick={handleClose}>
            {t('teams.vacancies.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
          >
            {t('teams.vacancies.addOption')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
