import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      rollupConfig: {
        external: [
          '@prisma/client',
          '@prisma/client/runtime/client',
          '@prisma/adapter-pg',
          '@prisma/adapter-libsql',
          '@libsql/client',
          'pg',
        ],
      },
      rolldownConfig: {
        external: [
          '@prisma/client',
          '@prisma/client/runtime/client',
          '@prisma/adapter-pg',
          '@prisma/adapter-libsql',
          '@libsql/client',
          'pg',
        ],
      },
    }),
    viteReact(),
  ],
})

export default config
