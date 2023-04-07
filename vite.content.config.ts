import path from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  define: {
    'process.env': {}
  },
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      formats: ['iife'],
      entry: path.resolve(__dirname, './content-script/index.ts'),
      name: 'Cat Facts'
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        extend: true,
      }
    }
  }
})
