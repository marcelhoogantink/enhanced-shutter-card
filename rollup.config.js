import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { readdirSync } from 'fs';
const plugins = [
  resolve(),
  replace({ preventAssignment: true, __VERSION__: process.env.GITHUB_REF_NAME ?? 'dev' }),
  terser(),
];
// Auto-detect all .js files in src/
const srcInputs = readdirSync('src')
  .filter(file => file.endsWith('.js'))
  .map(file => ({
    input: `src/${file}`,
    output: { file: `dist/${file}`, format: 'es' },
    plugins,
  }));

// Main file in root
const rootInputs = readdirSync('.')
  .filter(file => file.endsWith('.js') && file === 'enhanced-shutter-card.js')
  .map(file => ({
    input: file,
    output: { file: `dist/${file}`, format: 'es' },
    plugins,
  }));

export default [...rootInputs, ...srcInputs];