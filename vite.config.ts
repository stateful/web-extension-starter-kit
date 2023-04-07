import { defineConfig } from 'vite'

const fetchVersion = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /__APP_VERSION__/,
        `v${process.env.npm_package_version}`
      )
    }
  }
}

export default defineConfig({
  plugins: [fetchVersion()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: new URL('./index.html', import.meta.url).pathname,
        background: new URL('./background.html', import.meta.url).pathname,
      }
    }
  }
})
