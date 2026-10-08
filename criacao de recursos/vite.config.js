import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/components/ui'), // Novo alias para componentes de UI
      '@modules': path.resolve(__dirname, './src/components/Modules'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@lesson': path.resolve(__dirname, './src/components/LessonRenderer'),
    },
  },
})
