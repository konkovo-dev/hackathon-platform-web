import fs from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'src')

const TARGET_DIRS = [
  path.join(SRC, 'app'),
  path.join(SRC, 'features'),
  path.join(SRC, 'widgets'),
  path.join(SRC, 'entities'),
]

const IGNORE_PATH_PARTS = [
  `${path.sep}app${path.sep}design-system${path.sep}`, // демо-страница, пока без локализации
]

const IGNORE_ATTRS = new Set([
  'className',
  'id',
  'strategy',
  'href',
  'src',
  'type',
  'name',
  'value',
  'htmlFor',
  'variant',
  'size',
  'color',
  'colorClassName',
  'inputType',
  'inputId',
])

const hasLettersOrDigits = (s) => /[\p{L}\p{N}]/u.test(s)

const isIgnoredFile = (filePath) => IGNORE_PATH_PARTS.some((p) => filePath.includes(p))

const listFiles = async (dir) => {
  const out = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...(await listFiles(full)))
      continue
    }
    if (e.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
      out.push(full)
    }
  }
  return out
}

const getLineCol = (sourceFile, pos) => {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos)
  return { line: line + 1, col: character + 1 }
}

const report = (filePath, msg) => {
  return `${path.relative(ROOT, filePath)}: ${msg}`
}

const checkFile = async (filePath) => {
  if (isIgnoredFile(filePath)) return []

  const code = await fs.readFile(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )

  const problems = []

  const visit = (node) => {
    // JSXText: <div>Текст</div>
    if (ts.isJsxText(node)) {
      const text = node.getText(sourceFile).replace(/\s+/g, ' ').trim()
      if (text && hasLettersOrDigits(text)) {
        const { line, col } = getLineCol(sourceFile, node.getStart(sourceFile))
        problems.push(report(filePath, `${line}:${col} raw JSXText: "${text}"`))
      }
    }

    // JSX attribute string: aria-label="..."
    if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText(sourceFile)
      if (!IGNORE_ATTRS.has(name) && ts.isStringLiteral(node.initializer)) {
        const text = node.initializer.text.trim()
        if (text && hasLettersOrDigits(text)) {
          const { line, col } = getLineCol(sourceFile, node.initializer.getStart(sourceFile))
          problems.push(report(filePath, `${line}:${col} raw JSX attr "${name}": "${text}"`))
        }
      }
    }

    // JSX expression string: {"Текст"} or {`Text`}
    if (ts.isJsxExpression(node) && node.expression) {
      const expr = node.expression
      if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
        const text = expr.text.trim()
        if (text && hasLettersOrDigits(text)) {
          const { line, col } = getLineCol(sourceFile, expr.getStart(sourceFile))
          problems.push(report(filePath, `${line}:${col} raw JSX string: "${text}"`))
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return problems
}

const main = async () => {
  const cmd = process.argv[2]
  if (cmd !== 'check') {
    console.error('Usage: node scripts/strings.mjs check')
    process.exit(2)
  }

  const files = (
    await Promise.all(
      TARGET_DIRS.map(async (dir) => {
        try {
          return await listFiles(dir)
        } catch {
          return []
        }
      })
    )
  )
    .flat()
    .sort()

  const allProblems = []
  for (const f of files) {
    const problems = await checkFile(f)
    allProblems.push(...problems)
  }

  if (allProblems.length) {
    console.error(allProblems.join('\n'))
    process.exit(1)
  }
}

await main()
