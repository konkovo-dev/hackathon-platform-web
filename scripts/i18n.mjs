import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const LOCALES_DIR = path.join(ROOT, 'src', 'shared', 'i18n', 'locales')
const GENERATED_FILE = path.join(ROOT, 'src', 'shared', 'i18n', 'generated.ts')

const isPlainObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)
const isPluralLeaf = (v) => isPlainObject(v) && typeof v.other === 'string'

const flatten = (obj, prefix = '') => {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'string' || isPluralLeaf(v)) {
      out[key] = true
      continue
    }
    if (isPlainObject(v)) {
      Object.assign(out, flatten(v, key))
    }
  }
  return out
}

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

const readLocalesIndex = async () => {
  const locales = (await fs.readdir(LOCALES_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  const perLocaleNamespaces = new Map()
  for (const locale of locales) {
    const dir = path.join(LOCALES_DIR, locale)
    const namespaces = (await fs.readdir(dir, { withFileTypes: true }))
      .filter((d) => d.isFile() && d.name.endsWith('.json'))
      .map((d) => d.name.replace(/\.json$/, ''))
      .sort()
    perLocaleNamespaces.set(locale, namespaces)
  }

  return { locales, perLocaleNamespaces }
}

const check = async () => {
  const { locales, perLocaleNamespaces } = await readLocalesIndex()
  if (locales.length === 0) {
    throw new Error('No locales found in src/shared/i18n/locales')
  }

  const baseLocale = locales[0]
  const baseNamespaces = perLocaleNamespaces.get(baseLocale) ?? []

  for (const locale of locales) {
    const ns = perLocaleNamespaces.get(locale) ?? []
    const same =
      ns.length === baseNamespaces.length && ns.every((v, i) => v === baseNamespaces[i])
    if (!same) {
      throw new Error(
        `Namespaces mismatch. Base (${baseLocale}): [${baseNamespaces.join(
          ', '
        )}] vs ${locale}: [${ns.join(', ')}]`
      )
    }
  }

  const keySets = new Map()
  for (const locale of locales) {
    const namespaces = perLocaleNamespaces.get(locale)
    const keys = new Set()

    for (const ns of namespaces) {
      const jsonPath = path.join(LOCALES_DIR, locale, `${ns}.json`)
      const data = await readJson(jsonPath)
      const flat = flatten(data)
      for (const k of Object.keys(flat)) keys.add(`${ns}.${k}`)
    }

    keySets.set(locale, keys)
  }

  const baseKeys = keySets.get(baseLocale)
  for (const locale of locales) {
    const keys = keySets.get(locale)
    const missing = [...baseKeys].filter((k) => !keys.has(k))
    const extra = [...keys].filter((k) => !baseKeys.has(k))
    if (missing.length || extra.length) {
      throw new Error(
        [
          `Keys mismatch for locale "${locale}" относительно "${baseLocale}":`,
          missing.length ? `  missing: ${missing.slice(0, 50).join(', ')}` : null,
          extra.length ? `  extra: ${extra.slice(0, 50).join(', ')}` : null,
        ]
          .filter(Boolean)
          .join('\n')
      )
    }
  }

  return { locales, namespaces: baseNamespaces, keys: [...baseKeys].sort() }
}

const gen = async () => {
  const { keys } = await check()

  const content = `// AUTO-GENERATED. DO NOT EDIT.\n// Run: pnpm i18n:gen\n\nexport const I18N_KEYS = ${JSON.stringify(
    keys,
    null,
    2
  )} as const\n\nexport type I18nKey = (typeof I18N_KEYS)[number]\n`

  await fs.writeFile(GENERATED_FILE, content, 'utf8')
}

const main = async () => {
  const cmd = process.argv[2]
  if (cmd !== 'check' && cmd !== 'gen') {
    console.error('Usage: node scripts/i18n.mjs <check|gen>')
    process.exit(2)
  }

  try {
    if (cmd === 'check') {
      await check()
      return
    }
    await gen()
  } catch (e) {
    console.error(e?.stack || String(e))
    process.exit(1)
  }
}

await main()
