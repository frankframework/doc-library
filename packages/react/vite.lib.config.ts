import type { UserConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import react from '@vitejs/plugin-react';

export default {
  publicDir: 'projects/ff-doc/public',
  build: {
    lib: {
      entry: 'projects/ff-doc/src/public-api.ts',
      formats: ['es'],
      fileName: 'doc-library-react',
    },
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      external: ['react'],
    },
  },
  plugins: [dts({ tsconfigPath: './tsconfig.lib.json' }), react()],
} satisfies UserConfig;
