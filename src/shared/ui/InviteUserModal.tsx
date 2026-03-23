'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  ErrorAlert,
  Modal,
  Input,
  SelectList,
  ListItem,
  Button,
  Section,
} from '@/shared/ui'
import { useUsersSearchQuery } from '@/entities/user'

export interface InviteUserModalProps {
  open: boolean
  onClose: () => void
  title: string
  submitLabel: string
  cancelLabel: string
  isPending?: boolean
  searchSectionTitle: string
  searchPlaceholder: string
  loadingLabel: string
  middleSection?: ReactNode
  messageSection?: ReactNode
  error?: string | null
  onInvite: (selectedUserId: string) => void | Promise<void>
}

const SEARCH_LIST_HEIGHT = '160px'

export function InviteUserModal({
  open,
  onClose,
  title,
  submitLabel,
  cancelLabel,
  isPending = false,
  searchSectionTitle,
  searchPlaceholder,
  loadingLabel,
  middleSection,
  messageSection,
  error,
  onInvite,
}: InviteUserModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { data: usersData, isLoading: isSearching } = useUsersSearchQuery(searchQuery)
  const users = usersData?.users ?? []

  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setSelectedUserId(null)
    }
  }, [open])

  const handleClose = () => {
    onClose()
  }

  const handleInvite = async () => {
    if (!selectedUserId) return
    await Promise.resolve(onInvite(selectedUserId))
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} size="lg">
      <div className="flex flex-col gap-m6 overflow-y-auto min-h-0 max-h-[min(85vh,720px)]">
        <Section title={searchSectionTitle} variant="outlined" className="shrink-0">
          <Input
            variant="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            autoFocus
          />
          <div className="mt-m4" style={{ minHeight: SEARCH_LIST_HEIGHT }}>
            {searchQuery.length < 2 ? (
              <div className="flex items-center justify-center py-m6">
                <p className="typography-body-sm text-text-secondary">{searchPlaceholder}</p>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-m6">
                <p className="typography-body-sm text-text-secondary">{loadingLabel}</p>
              </div>
            ) : users.length > 0 ? (
              <div
                className="overflow-y-auto"
                style={{ maxHeight: SEARCH_LIST_HEIGHT }}
              >
                <SelectList>
                  {users.map(user => {
                    if (!user.userId) return null
                    const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
                    const displayText =
                      name ? `${name} (${user.username || user.userId})` : user.username || user.userId
                    return (
                      <ListItem
                        key={user.userId}
                        text={displayText}
                        selectable
                        selected={selectedUserId === user.userId}
                        variant="bordered"
                        onClick={() => setSelectedUserId(user.userId!)}
                      />
                    )
                  })}
                </SelectList>
              </div>
            ) : null}
          </div>
        </Section>

        {middleSection}

        {messageSection && <div className="shrink-0">{messageSection}</div>}

        <div className="flex flex-col gap-m4 shrink-0 pt-m2">
          {error && <ErrorAlert message={error} />}
          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleInvite}
              disabled={!selectedUserId || isPending}
            >
              {isPending ? loadingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
