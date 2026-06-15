import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/Investment-Calculator/',
  plugins: [
    react(),
    {
      name: 'serve-manifest-at-root',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const urlPath = req.url.split('?')[0];
          if (urlPath === '/manifest.json') {
            try {
              const manifestPath = path.resolve(__dirname, 'public/manifest.json');
              const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(manifestContent);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          } else {
            next();
          }
        });
      }
    }
  ],
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