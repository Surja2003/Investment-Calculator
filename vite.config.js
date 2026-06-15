// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Investment-Calculator/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React + routing core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // MUI chunked separately
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Charts
          'vendor-charts': ['recharts', 'framer-motion'],
          // Calculator pages (loaded on demand via lazy())
          'page-home': ['./src/pages/Home'],
          'page-calculators': [
            './src/components/DesktopCalculator',
            './src/components/MobileCalculator',
            './src/components/ResponsiveCalculator',
          ],
          'page-emi': ['./src/pages/EMICalculator'],
          'page-compare': ['./src/pages/CompareMode'],
          'page-reverse': ['./src/pages/ReverseSIP'],
          'page-glossary': ['./src/pages/Glossary'],
        }
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  }
});