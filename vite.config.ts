import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

function escapeInlineScript(code: string): string {
  return code
    .replace(/<\/(script|style|head)/gi, '\\x3C/$1')
    .replace(/<!--/g, '\\x3C!--');
}

function selfContainedBuildPlugin(rootDir: string): Plugin {
  const logoRelPath = './assets/aistudio/logo_piccolo_fc815523.png';
  const logoAbsPath = path.resolve(rootDir, 'public/assets/aistudio/logo_piccolo_fc815523.png');

  return {
    name: 'self-contained-build',
    apply: 'build',
    transform(code: string, id: string) {
      if (id.endsWith('.tsx') && code.includes(logoRelPath) && fs.existsSync(logoAbsPath)) {
        const b64 = fs.readFileSync(logoAbsPath).toString('base64');
        const dataUri = `data:image/png;base64,${b64}`;
        return {
          code: code.split(logoRelPath).join(dataUri),
          map: null,
        };
      }
      return null;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html: string, ctx) {
        if (!ctx.bundle) return html;

        let outHtml = html;
        const inlineStyles: string[] = [];
        const inlineScripts: string[] = [];

        for (const [fileName, asset] of Object.entries(ctx.bundle)) {
          if (asset.type === 'asset' && fileName.endsWith('.css')) {
            const cssText =
              typeof asset.source === 'string'
                ? asset.source
                : Buffer.from(asset.source).toString('utf8');
            inlineStyles.push(cssText.replace(/<\/style/gi, '\\3C/style'));
            const escapedName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            outHtml = outHtml.replace(
              new RegExp(`<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*${escapedName}["'][^>]*>`, 'gi'),
              ''
            );
            delete ctx.bundle[fileName];
          } else if (asset.type === 'chunk' && asset.isEntry) {
            inlineScripts.push(escapeInlineScript(asset.code));
            const escapedName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            outHtml = outHtml.replace(
              new RegExp(`<script[^>]*type=["']module["'][^>]*src=["'][^"']*${escapedName}["'][^>]*>\\s*</script>`, 'gi'),
              ''
            );
            delete ctx.bundle[fileName];
          }
        }

        if (inlineStyles.length > 0) {
          const styleBlock = inlineStyles.map((css) => `<style>${css}</style>`).join('\n');
          outHtml = outHtml.replace('</head>', () => `${styleBlock}\n  </head>`);
        }

        if (inlineScripts.length > 0) {
          const scriptBlock = inlineScripts
            .map((js) => `<script type="module">\n${js}\n</script>`)
            .join('\n');
          outHtml = outHtml.replace('</body>', () => `    ${scriptBlock}\n  </body>`);
        }

        return outHtml;
      },
    },
  };
}

export default defineConfig(() => {
  const rootDir = path.dirname(fileURLToPath(import.meta.url));
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      selfContainedBuildPlugin(rootDir),
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
      chunkSizeWarningLimit: 3000,
      rolldownOptions: {
        output: {
          codeSplitting: false,
        },
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
