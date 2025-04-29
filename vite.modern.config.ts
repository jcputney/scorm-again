import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import eslint from 'vite-plugin-eslint';

// Define entry points for regular files
const regularEntries = {
  aicc: './src/AICC.ts',
  scorm12: './src/Scorm12API.ts',
  scorm2004: './src/Scorm2004API.ts',
  'scorm-again': './src/ScormAgain.ts',
  'cross-frame-facade': './src/facades/CrossFrameFacade.ts',
};

// Define entry points for minified files
const minEntries = {
  'aicc.min': './src/AICC.ts',
  'scorm12.min': './src/Scorm12API.ts',
  'scorm2004.min': './src/Scorm2004API.ts',
  'scorm-again.min': './src/ScormAgain.ts',
  'cross-frame-facade.min': './src/facades/CrossFrameFacade.ts',
};

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  // Combine entries based on mode
  const entries = {
    ...regularEntries,
    ...(isProduction ? minEntries : {}),
  };

  // Create input object for build.lib
  const input = {};
  Object.keys(entries).forEach(name => {
    input[name] = resolve(__dirname, entries[name]);
  });

  return {
    plugins: [
      dts({ include: ['src/**/*.ts'] }),
      eslint({
        include: ['src/**/*.ts'],
        emitError: isProduction,
        emitWarning: true,
      }),
    ],
    build: {
      lib: {
        entry: input,
        formats: ['es'],
        fileName: (format, entryName) => `modern/${entryName}.js`,
      },
      outDir: 'dist',
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          passes: 3,
          drop_console: false,
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_methods: true,
          unsafe_proto: true,
        },
        output: {
          comments: false,
        },
        mangle: true,
      } : undefined,
      sourcemap: !isProduction,
      rollupOptions: {
        external: ['window.API', 'window.API_1484_11'],
        output: {
          preserveModules: false,
          exports: 'named',
        },
      },
      target: 'es2015', // This is the key difference for modern builds
    },
  };
}); 