import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const prismaExternalPackages = [
  '@prisma/client',
  '@prisma/adapter-pg',
  '@prisma/adapter-libsql',
  '@libsql/client',
  'pg',
]

const asyncHooksStubId = '\0node-async-hooks-browser-stub'
const streamStubId = '\0node-stream-browser-stub'
const streamWebStubId = '\0node-stream-web-browser-stub'

function browserNodeBuiltinStubs(): Plugin {
  return {
    name: 'browser-node-builtin-stubs',
    enforce: 'pre',
    resolveId(source, _importer, options) {
      if (options.ssr) return
      if (source === 'node:async_hooks') return asyncHooksStubId
      if (source === 'node:stream') return streamStubId
      if (source === 'node:stream/web') return streamWebStubId
    },
    load(id) {
      if (id === asyncHooksStubId) {
        return `
class AsyncLocalStorage {
  disable() {}
  enterWith() {}
  getStore() {
    return undefined
  }
  run(_store, callback, ...args) {
    return callback(...args)
  }
}

export { AsyncLocalStorage }
`
      }

      if (id === streamStubId) {
        return `
class PassThrough {
  constructor() {
    throw new Error('node:stream is not available in the browser')
  }
}

class Readable {
  static fromWeb() {
    throw new Error('node:stream is not available in the browser')
  }
  static toWeb() {
    throw new Error('node:stream is not available in the browser')
  }
}

export { PassThrough, Readable }
`
      }

      if (id === streamWebStubId) {
        return `
const ReadableStream = globalThis.ReadableStream
const TransformStream = globalThis.TransformStream
const WritableStream = globalThis.WritableStream

export { ReadableStream, TransformStream, WritableStream }
`
      }
    },
  }
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    browserNodeBuiltinStubs(),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      rollupConfig: {
        external: [
          'react',
          'react-dom',
          'react-dom/server',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
      },
      rolldownConfig: {
        external: [
          'react',
          'react-dom',
          'react-dom/server',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
      },
      traceDeps: prismaExternalPackages,
    }),
    viteReact(),
  ],
})

export default config
