import resolve from '@rollup/plugin-node-resolve';
import copy from "rollup-plugin-copy";
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const plugins = [
  resolve(),
  replace({ preventAssignment: true, __VERSION__: process.env.GITHUB_REF_NAME ?? 'dev' }),
  terser(),
  copy({
    targets: [
      {
        src: "src/*.png",
        dest: "dist",
      },
    ],
    hook: "writeBundle",
    verbose: true,
    }),
];

export default {
  input: 'src/enhanced-shutter-card.js',
  output: {
    file: 'dist/enhanced-shutter-card.js',
    format: 'es',
  },
  plugins,
};
