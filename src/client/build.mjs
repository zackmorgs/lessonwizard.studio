import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import { readFile } from 'fs/promises';
import { copyFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.argv.includes('--dev');
const outdir = resolve(__dirname, '../server/Host/wwwroot/assets');
const wwwroot = resolve(__dirname, '../server/Host/wwwroot');

// Ensure wwwroot and assets dirs exist
await mkdir(outdir, { recursive: true });

// Copy index.html to wwwroot
await copyFile(
  resolve(__dirname, 'index.html'),
  resolve(wwwroot, 'index.html')
);

const postcssPlugin = {
  name: 'postcss',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const source = await readFile(args.path, 'utf8');
      const result = await postcss([tailwindcss, autoprefixer]).process(source, {
        from: args.path,
      });
      return { contents: result.css, loader: 'css' };
    });
  },
};

const config = {
  entryPoints: [{ in: 'src/main.jsx', out: 'app' }],
  bundle: true,
  outdir,
  format: 'esm',
  sourcemap: isDev,
  minify: !isDev,
  plugins: [
    postcssPlugin,
    sassPlugin({
      filter: /\.scss$/,
      async transform(source) {
        const { css } = await postcss([autoprefixer]).process(source, { from: undefined });
        return css;
      },
    }),
  ],
};

if (isDev) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(config);
  console.log('Build complete.');
}
