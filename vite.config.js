import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base: '/', // Adjust if deploying to a subdirectory, e.g., '/subpath/'
  build: {
    outDir: 'dist', // Output directory for build files
    assetsDir: 'assets', // Directory for assets like images
    sourcemap: false // Set to true for debugging, false for production
  }
})