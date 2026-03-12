'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { cn } from '@/shared/lib/cn'
import { ListItem, SelectList } from '@/shared/ui'

type BackendTarget = 'remote' | 'local'

interface BackendState {
  target: BackendTarget
  platformApiUrl: string
}

const BACKENDS: { target: BackendTarget; label: string }[] = [
  { target: 'remote', label: 'remote  ·  178.154.192.57:8080' },
  { target: 'local', label: 'local  ·  localhost:8080' },
]

export function DebugBackendSwitcher() {
  const [state, setState] = useState<BackendState | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetch('/api/debug/backend')
      .then(r => r.json())
      .then(setState)
      .catch(() => null)
  }, [])

  const switchTo = useCallback((target: BackendTarget) => {
    startTransition(async () => {
      const res = await fetch('/api/debug/backend', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ target }),
      })
      if (res.ok) {
        setState(await res.json())
        window.location.reload()
      }
    })
  }, [])

  if (!state) return null

  const isRemote = state.target === 'remote'

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-m2">
      {expanded && (
        <div className="bg-bg-elevated border border-border-default rounded-m4 p-m4 min-w-[220px] shadow-lg">
          <p className="typography-overline-xs text-text-tertiary px-m2 mb-m4">backend</p>
          <SelectList>
            {BACKENDS.map(({ target, label }) => (
              <ListItem
                key={target}
                text={label}
                selectable
                selected={state.target === target}
                variant="bordered"
                onClick={() => !isPending && switchTo(target)}
              />
            ))}
          </SelectList>
        </div>
      )}

      <button
        onClick={() => setExpanded(v => !v)}
        className={cn(
          'flex items-center gap-m2 px-m4 py-m2 rounded-full border typography-caption-sm-medium',
          isRemote
            ? 'bg-state-success-bg border-state-success text-state-success'
            : 'bg-state-info-bg border-state-info text-state-info'
        )}
      >
        <span className="text-[8px]">●</span>
        {state.target}
      </button>
    </div>
  )
}
