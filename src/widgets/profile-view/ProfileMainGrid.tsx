import type { ReactNode } from 'react'

const GRID_TEMPLATE_COLUMNS = 'minmax(0, 240px) 1fr' as const

export function ProfileMainGrid({
  sidebar,
  main,
}: {
  sidebar: ReactNode
  main: ReactNode
}) {
  return (
    <div
      className="grid w-full min-h-0 gap-m8"
      style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
    >
      <div className="flex w-full flex-col gap-m4">{sidebar}</div>
      <div className="flex min-w-0 flex-col gap-m8">{main}</div>
    </div>
  )
}
