import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Lee las variables del archivo .env de la raíz del proyecto
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    // Reemplaza process.env.* por sus valores, porque el navegador no tiene process
    define: {
      'typeof process': JSON.stringify('object'),
      'process.env.RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY),
      'process.env.RESEND_BASE_URL': JSON.stringify('/resend-api'),
      'process.env.CORREO_PRUEBA': JSON.stringify(env.CORREO_PRUEBA),
    },
    server: {
      // El navegador bloquea api.resend.com por CORS: Vite reenvía /resend-api hacia Resend
      proxy: {
        '/resend-api': {
          target: 'https://api.resend.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/resend-api/, ''),
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/testing/setup.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{js,jsx}'],
        exclude: ['src/main.jsx', 'src/testing/**'],
      },
    },
  }
})
