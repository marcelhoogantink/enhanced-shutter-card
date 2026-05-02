import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const plugins = [
  resolve(),
  replace({ preventAssignment: true, __VERSION__: process.env.GITHUB_REF_NAME ?? 'dev' }),
  terser(),
];

export default {
  input: 'enhanced-shutter-card.js',
  output: {
    file: 'dist/enhanced-shutter-card.js',
    format: 'es',
  },
  plugins,
};