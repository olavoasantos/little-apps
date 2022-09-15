import {cwd} from '@micra/vite-config/utilities/cwd';
import {defineConfig} from '@micra/vite-config/library';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@remix-run/web-fetch', '@remix-run/web-file'],
      input: {
        index: cwd('index.ts'),
        fetch: cwd('fetch.ts'),
      },
    },
  },
});
