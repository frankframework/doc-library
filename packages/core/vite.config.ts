import type { UserConfig } from 'vite';
import dts from 'unplugin-dts/vite';

export default {
  build: {
    lib: {
      entry: 'src/public-api.ts',
      name: 'ff-doc-core',
      formats: ['es'],
    },
    sourcemap: true,
  },
  plugins: [dts({ bundleTypes: true, tsconfigPath: './tsconfig.json' })],
} satisfies UserConfig;
