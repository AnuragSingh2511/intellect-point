/**
 * Patch @noble/ciphers inside better-auth's node_modules
 * Fixes: managedNonce is not exported by @noble/ciphers/utils.js
 */
import fs from 'node:fs'
import path from 'node:path'

const targetFile = path.resolve(
  'node_modules/better-auth/node_modules/@noble/ciphers/index.js',
)

if (!fs.existsSync(targetFile)) {
  console.log('  [patch-noble-ciphers] target file not found, skipping')
  process.exit(0)
}

let content = fs.readFileSync(targetFile, 'utf-8')

const badImport =
  "import { managedNonce, randomBytes, bytesToHex, hexToBytes } from '@noble/ciphers/utils.js';"
const goodImport = `import { bytesToHex, hexToBytes } from '@noble/ciphers/utils.js';
import { managedNonce, randomBytes } from '@noble/ciphers/webcrypto.js';`

if (content.includes(badImport)) {
  content = content.replace(badImport, goodImport)
  fs.writeFileSync(targetFile, content, 'utf-8')
  console.log('  [patch-noble-ciphers] applied')
} else if (content.includes(goodImport)) {
  console.log('  [patch-noble-ciphers] already patched')
} else {
  console.log('  [patch-noble-ciphers] unexpected content, skipping')
}
