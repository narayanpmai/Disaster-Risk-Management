import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    proxy: {
      '/api/v1/chat': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/v1/gis/buffer-analysis': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/v1/gis/risk-zoning': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/v1/analytics': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        'index': resolve(__dirname, 'index.html'),
        'app': resolve(__dirname, 'app.html'),
        'badapatra': resolve(__dirname, 'badapatra.html'),
        'one-pager': resolve(__dirname, 'one-pager.html'),
        'public-report': resolve(__dirname, 'public-report.html'),
        'super-admin': resolve(__dirname, 'super-admin.html'),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) {
              return 'vendor-echarts';
            }
            if (id.includes('chart.js')) {
              return 'vendor-chartjs';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-leaflet';
            }
            if (id.includes('@itzsa/nepal-geo-data') || id.includes('nepal-administrative-data')) {
              return 'vendor-nepal-gis-data';
            }
            if (id.includes('xlsx')) {
              return 'vendor-xlsx';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@tanstack/react-query') || id.includes('axios')) {
              return 'vendor-network';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react-core';
            }
            return 'vendor-libs';
          }
          if (id.includes('/src/features/')) {
            const match = id.match(/\/src\/features\/([^/]+)/);
            if (match) {
              return `feature-${match[1]}`;
            }
          }
          if (id.includes('/src/pages/public/')) {
            const match = id.match(/\/src\/pages\/public\/([^/.]+)/);
            if (match) {
              return `page-${match[1].toLowerCase()}`;
            }
          }
        }
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '/api/v1')
  }
})
