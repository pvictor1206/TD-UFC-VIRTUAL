import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build separado (não faz parte do `npm run build` normal) que empacota o
// motor de renderização de aulas (React + componentes de UI + Tailwind
// compilado) em um único par de arquivos standalone.js / standalone.css.
// Esses arquivos ficam versionados em public/standalone/ e são usados pelo
// Construtor de Aulas para montar o pacote HTML+CSS+JS que a pessoa baixa.
//
// Rodar `npm run build:standalone` sempre que LessonRenderer ou os
// componentes de src/components/ui/ mudarem.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // O bundle roda direto via file:// (sem servidor/Node), então não existe
  // `process`. Substitui as referências em tempo de build para não quebrar
  // em produção.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@lesson': path.resolve(__dirname, './src/components/LessonRenderer'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    outDir: 'public/standalone',
    emptyOutDir: true,
    copyPublicDir: false, // evita copiar o resto de public/ para dentro de public/standalone
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/standalone/main.jsx'),
      name: 'LessonStandalone',
      formats: ['iife'],
      fileName: () => 'standalone.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith('.css') ? 'standalone.css' : 'assets/[name][extname]',
      },
    },
  },
});
