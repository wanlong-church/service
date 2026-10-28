import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Same as the `@/*` path in tsconfig.json
    alias: { '@': dirname(fileURLToPath(import.meta.url)) },
  },
})
