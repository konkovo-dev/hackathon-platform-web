import type { Decision } from './decision'

export function AccessGate({
  decision,
  children,
  fallback = null,
}: {
  decision: Decision
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  if (!decision.allowed) return <>{fallback}</>
  return <>{children}</>
}
