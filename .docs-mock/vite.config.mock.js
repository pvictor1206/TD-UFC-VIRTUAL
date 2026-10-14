import { defineConfig, mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import base from '../vite.config.js';

const here = path.dirname(fileURLToPath(import.meta.url));

// Build de demonstração (só para as imagens do manual): troca o Supabase por dados fictícios em memória.
export default mergeConfig(base, defineConfig({
  resolve: { alias: [{ find: /^\.\/supabase$/, replacement: path.join(here, 'mock-supabase.ts') }] },
  build: { outDir: path.join(here, 'dist'), emptyOutDir: true },
}));
