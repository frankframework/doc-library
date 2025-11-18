import type { UserConfig } from 'vite';
import dts from 'unplugin-dts/vite';

export default {
  build: {
    lib: {
      entry: 'src/public-api.ts',
      formats: ['es'],
    },
    sourcemap: true,
    target: 'es2022',
  },
  plugins: [dts({ tsconfigPath: './tsconfig.json' })],
} satisfies UserConfig;
