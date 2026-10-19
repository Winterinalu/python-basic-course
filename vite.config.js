import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync, cpSync } from 'node:fs';
import { resolve } from 'node:path';

const publishRoot = {
  name: 'publish-root-pages-files',
  apply: 'build',
  closeBundle() {
    const output = resolve('dist');
    copyFileSync(resolve(output, 'index.html'), resolve('index.html'));
    cpSync(resolve(output, 'assets'), resolve('assets'), { recursive: true });
    for (const file of ['404.html', 'python-worker.js']) copyFileSync(resolve(output, file), resolve(file));
  },
};

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [tailwindcss(), publishRoot],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});