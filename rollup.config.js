import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
];

const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
};

// Function to handle optional dependencies
function isExternal(id) {
  // Always externalize React
  if (external.includes(id)) return true;
  
  // Make Capacitor packages optional/external
  if (id.startsWith('@capacitor/')) return true;
  
  return false;
}

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'CodeCraftStudio',
      globals: (id) => {
        if (id.startsWith('@capacitor/')) {
          // Return a safe global name for Capacitor packages
          return id.replace('@capacitor/', 'Capacitor').replace(/[^a-zA-Z0-9]/g, '');
        }
        return globals[id] || id;
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
  external: isExternal,
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
      // Don't bundle optional dependencies
      resolveOnly: (module) => {
        if (module.startsWith('@capacitor/')) return false;
        return true;
      },
    }),
    commonjs({
      // Handle dynamic requires
      ignoreDynamicRequires: true,
      // Transform dynamic imports
      transformMixedEsModules: true,
    }),
    json(),
  ],
  // Suppress warnings for optional dependencies
  onwarn(warning, warn) {
    // Skip certain warnings
    if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('@capacitor/')) {
      return;
    }
    if (warning.code === 'MISSING_EXPORT' && warning.message.includes('@capacitor/')) {
      return;
    }
    // Use default for everything else
    warn(warning);
  },
};