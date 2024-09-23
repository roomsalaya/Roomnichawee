import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/roomnichawee/',  // ชื่อ repository ของคุณ
})
