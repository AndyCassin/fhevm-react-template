import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['react', 'ethers', 'fhevmjs'],
  },
  {
    entry: {
      'react/index': 'src/react/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'ethers', 'fhevmjs'],
  },
]);
