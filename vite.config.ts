import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

function dualTargetHtmlPlugin(rootDir: string): Plugin[] {
  const entryHtmlPath = path.resolve(rootDir, 'entry.html');

  const servePlugin: Plugin = {
    name: 'serve-entry-html-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const reqPath = req.url?.split('?')[0];
        if (reqPath === '/' || reqPath === '/index.html') {
          try {
            const rawHtml = fs.readFileSync(entryHtmlPath, 'utf8');
            const html = await server.transformIndexHtml(req.url || '/', rawHtml);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
          } catch (err) {
            next(err);
            return;
          }
        }
        next();
      });
    },
  };

  const buildPlugin: Plugin = {
    name: 'sync-static-root-from-dist',
    apply: 'build',
    closeBundle(error?: Error): void {
      if (error) {
        return;
      }
      const distDir = path.resolve(rootDir, 'dist');
      const distEntryHtml = path.resolve(distDir, 'entry.html');
      const distHtml = path.resolve(distDir, 'index.html');
      const distAssets = path.resolve(distDir, 'assets');
      const distFavicon = path.resolve(distDir, 'favicon.svg');

      if (fs.existsSync(distEntryHtml)) {
        fs.renameSync(distEntryHtml, distHtml);
      }

      if (!fs.existsSync(distHtml)) {
        return;
      }

      fs.copyFileSync(distHtml, path.resolve(rootDir, 'index.html'));

      if (fs.existsSync(distFavicon)) {
        fs.copyFileSync(distFavicon, path.resolve(rootDir, 'favicon.svg'));
      }

      if (fs.existsSync(distAssets)) {
        const rootAssets = path.resolve(rootDir, 'assets');
        fs.rmSync(rootAssets, { recursive: true, force: true });
        fs.cpSync(distAssets, rootAssets, { recursive: true, force: true });
      }
    },
  };

  return [servePlugin, buildPlugin];
}

export default defineConfig(() => {
  const rootDir = path.dirname(fileURLToPath(import.meta.url));
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      ...dualTargetHtmlPlugin(rootDir),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
          }
        },
      },
    ],
    build: {
      rolldownOptions: {
        input: path.resolve(rootDir, 'entry.html'),
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    preview: {
      allowedHosts: true as const,
      host: '0.0.0.0',
      port: 3000,
    },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
