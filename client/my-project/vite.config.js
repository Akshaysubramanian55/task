import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['node_modules/slick-carousel/slick/fonts/slick.ttf', 'node_modules/slick-carousel/slick/fonts/slick.woff']
}
})
