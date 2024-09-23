import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Roomnichawee/',  // แก้ไขเป็นชื่อ repository ของคุณ
  plugins: [react()],
})

