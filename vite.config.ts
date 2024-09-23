import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Roomnichawee/'  // <-- ใส่ชื่อ repository ของคุณที่นี่
})
