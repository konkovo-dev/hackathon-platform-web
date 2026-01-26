export type Primitive = string | number | boolean | null | undefined

export type MessageParams = Record<string, Primitive>

export type PluralMessage = {
  one?: string
  few?: string
  many?: string
  other: string
}

export interface MessagesTree {
  [key: string]: string | PluralMessage | MessagesTree
}

export type FlatMessages = Record<string, string | PluralMessage>
