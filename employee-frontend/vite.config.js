import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  preview: {
    allowedHosts: ['employee-management-system-frontend-production.up.railway.app'],
  },
})
