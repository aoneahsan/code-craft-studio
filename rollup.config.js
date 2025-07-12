import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'QrCodeStudio',
      globals: {
        '@capacitor/core': 'capacitorExports',
        '@capacitor/preferences': 'capacitorPreferences',
        'react': 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.esm.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: [
    '@capacitor/core',
    '@capacitor/preferences',
    'react',
    'react-dom',
    'react/jsx-runtime',
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs(),
    json(),
  ],
};