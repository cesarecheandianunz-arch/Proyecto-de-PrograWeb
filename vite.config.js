import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Las llamadas a /api van al backend (carpeta backend/, puerto 3000).
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
