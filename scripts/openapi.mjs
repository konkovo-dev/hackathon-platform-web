import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

const root = resolve(process.cwd())

const run = (cmd, args) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
  })

const main = async () => {
  const cmd = process.argv[2]
  if (cmd !== 'gen') {
    // eslint-disable-next-line no-console
    console.error('Usage: node scripts/openapi.mjs gen')
    process.exit(1)
  }

  const configPath = resolve(root, 'openapi/openapi.config.json')
  const raw = await readFile(configPath, 'utf8')
  const config = JSON.parse(raw)

  const generators = Array.isArray(config.generators) ? config.generators : []
  if (generators.length === 0) {
    // eslint-disable-next-line no-console
    console.error('No generators found in openapi/openapi.config.json')
    process.exit(1)
  }

  const bin = resolve(root, 'node_modules/.bin/openapi-typescript')

  for (const g of generators) {
    const inputRaw =
      typeof g.input === 'string'
        ? resolve(root, g.input)
        : typeof g.inputEnv === 'string'
          ? process.env[g.inputEnv]
          : undefined

    if (!inputRaw) {
      if (g.optional) {
        // eslint-disable-next-line no-console
        console.log(`[openapi] ${g.name || ''} skipped (missing input)`)
        continue
      }

      // eslint-disable-next-line no-console
      console.error(`[openapi] ${g.name || ''} missing input. Set env or config.`)
      process.exit(1)
    }

    const input = inputRaw
    const output = resolve(root, g.output)

    // eslint-disable-next-line no-console
    console.log(`\n[openapi] ${g.name || ''}\n  input:  ${input}\n  output: ${output}\n`)

    await run(bin, [input, '-o', output])
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
