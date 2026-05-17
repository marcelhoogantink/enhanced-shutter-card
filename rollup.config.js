import resolve from '@rollup/plugin-node-resolve';
import copy from "rollup-plugin-copy";
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const ref = process.env.GITHUB_REF_NAME ?? 'dev';
const isPreRelease = process.env.PRE_RELEASE === 'true';

const plugins = [
  resolve(),
  replace({ 
    preventAssignment: true, 
    __VERSION__: ref,
  }),
  !isPreRelease && terser(),
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
].filter(Boolean);

export default {
  input: 'src/enhanced-shutter-card.js',
  output: {
    file: 'dist/enhanced-shutter-card.js',
    format: 'es',
  },
  plugins,
};
