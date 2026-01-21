import type { FlatMessages, MessagesTree, PluralMessage } from './types'

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const isPluralMessage = (v: unknown): v is PluralMessage => {
  if (!isPlainObject(v)) return false
  return typeof v.other === 'string'
}

export const flattenMessages = (tree: MessagesTree, prefix = ''): FlatMessages => {
  const out: FlatMessages = {}

  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k

    if (typeof v === 'string') {
      out[key] = v
      continue
    }

    if (isPluralMessage(v)) {
      out[key] = v
      continue
    }

    if (isPlainObject(v)) {
      Object.assign(out, flattenMessages(v as MessagesTree, key))
      continue
    }
  }

  return out
}
