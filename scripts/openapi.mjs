import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import swaggerToOpenAPI from 'swagger2openapi'

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

const fetchSpec = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}

const convertSwagger2ToOpenAPI3 = async (specContent) => {
  try {
    const spec = JSON.parse(specContent)
    
    if (spec.swagger && spec.swagger.startsWith('2')) {
      // eslint-disable-next-line no-console
      console.log('[openapi] Converting Swagger 2.0 to OpenAPI 3.0...')
      
      const result = await swaggerToOpenAPI.convertObj(spec, {
        patch: true,
        warnOnly: true,
      })
      
      return JSON.stringify(result.openapi, null, 2)
    }
    
    return specContent
  } catch (error) {
    throw new Error(`Failed to convert spec: ${error.message}`)
  }
}

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
    let inputRaw
    let useLocalFile = false

    if (typeof g.inputUrl === 'string') {
      // eslint-disable-next-line no-console
      console.log(`\n[openapi] ${g.name || ''} - fetching from ${g.inputUrl}`)
      try {
        let specContent = await fetchSpec(g.inputUrl)
        specContent = await convertSwagger2ToOpenAPI3(specContent)
        
        if (typeof g.inputFallback === 'string') {
          const fallbackPath = resolve(root, g.inputFallback)
          await writeFile(fallbackPath, specContent, 'utf8')
          // eslint-disable-next-line no-console
          console.log(`[openapi] ${g.name || ''} - saved to ${g.inputFallback}`)
          
          inputRaw = fallbackPath
          useLocalFile = true
        } else {
          inputRaw = g.inputUrl
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`[openapi] ${g.name || ''} - failed to fetch: ${error.message}`)
        
        if (typeof g.inputFallback === 'string') {
          // eslint-disable-next-line no-console
          console.log(`[openapi] ${g.name || ''} - using fallback ${g.inputFallback}`)
          inputRaw = resolve(root, g.inputFallback)
          useLocalFile = true
        } else {
          // eslint-disable-next-line no-console
          console.error(`[openapi] ${g.name || ''} - no fallback available`)
          process.exit(1)
        }
      }
    } else if (typeof g.input === 'string') {
      inputRaw = resolve(root, g.input)
    } else if (typeof g.inputEnv === 'string') {
      inputRaw = process.env[g.inputEnv]
    }

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
