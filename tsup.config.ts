import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  format: ['esm'],
  splitting: false,
  clean: true,
  sourcemap: true,
  dts: true,
  tsconfig: 'tsconfig.json',
  target: 'es2020',
  esbuildOptions(options) {
    options.alias = {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
