import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const criador = path.resolve(__dirname, 'criacao de recursos');

// O painel reaproveita o Construtor de Aulas da pasta "criacao de recursos"
// (mesmos aliases usados lá) e compartilha uma única cópia do React.
export default defineConfig({
  base: './', // caminhos relativos: funciona em qualquer subpasta (ex.: GitHub Pages)
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@ui': path.join(criador, 'src/components/ui'),
      '@lesson': path.join(criador, 'src/components/LessonRenderer'),
      '@assets': path.join(criador, 'src/assets'),
      '@modules': path.join(criador, 'src/components/Modules'),
      '@builder': path.join(criador, 'src/pages/Builder'),
      '@standalone': path.join(criador, 'public/standalone'),
    },
  },
  server: { fs: { allow: [__dirname] } },
});
