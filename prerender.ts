import fs from 'node:fs'
import path from 'node:path'

// We expect this script to be run AFTER vite build and vite build --ssr
const DIST_PATH = path.resolve(process.cwd(), 'dist')

async function run() {
  const template = fs.readFileSync(
    path.resolve(DIST_PATH, 'index.html'),
    'utf-8',
  )

  // Import the server-rendered app
  // Note: we use the .js extension because Vite will build it as ESM JS
  const { render } = await import(
    path.resolve(DIST_PATH, 'server/entry-server.js')
  )

  const { html: appHtml } = render()

  const html = template.replace('<!--ssr-outlet-->', appHtml)

  fs.writeFileSync(path.resolve(DIST_PATH, 'index.html'), html)

  // Cleanup server folder if wanted, but for now just leave it
  console.log('✅ Successfully pre-rendered index.html')
}

run().catch(console.error)
