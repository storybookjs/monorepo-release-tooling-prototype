// noinspection JSUnusedGlobalSymbols

import * as fs from 'fs-extra';
import type { RequestHandler } from 'express';
import type { ViteDevServer } from 'vite';
import express from 'express';
import { dirname, join, parse } from 'path';
import type { Options, StorybookConfig as StorybookBaseConfig } from '@junk-temporary-prototypes/types';
import { transformIframeHtml } from './transform-iframe-html';
import { createViteServer } from './vite-server';
import { build as viteBuild } from './build';
import type { ViteBuilder, StorybookConfigVite } from './types';

export { withoutVitePlugins } from './utils/without-vite-plugins';
export { hasVitePlugins } from './utils/has-vite-plugins';

export * from './types';

/**
 * @deprecated
 *
 * Import `StorybookConfig` from your framework, such as:
 *
 * `import type { StorybookConfig } from '@junk-temporary-prototypes/react-vite';`
 */
export type StorybookViteConfig = StorybookBaseConfig & StorybookConfigVite;

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

function iframeMiddleware(options: Options, server: ViteDevServer): RequestHandler {
  return async (req, res, next) => {
    if (!req.url.match(/^\/iframe\.html($|\?)/)) {
      next();
      return;
    }

    // We need to handle `html-proxy` params for style tag HMR https://github.com/storybookjs/builder-vite/issues/266#issuecomment-1055677865
    // e.g. /iframe.html?html-proxy&index=0.css
    if (req.query['html-proxy'] !== undefined) {
      next();
      return;
    }

    const indexHtml = await fs.readFile(
      require.resolve('@junk-temporary-prototypes/builder-vite/input/iframe.html'),
      'utf-8'
    );
    const generated = await transformIframeHtml(indexHtml, options);
    const transformed = await server.transformIndexHtml('/iframe.html', generated);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(transformed);
  };
}

let server: ViteDevServer;

export async function bail(): Promise<void> {
  return server?.close();
}

export const start: ViteBuilder['start'] = async ({
  startTime,
  options,
  router,
  server: devServer,
}) => {
  server = await createViteServer(options as Options, devServer);

  const previewResolvedDir = wrapForPnP('@junk-temporary-prototypes/preview');
  const previewDirOrigin = join(previewResolvedDir, 'dist');

  router.use(`/sb-preview`, express.static(previewDirOrigin, { immutable: true, maxAge: '5m' }));

  router.use(iframeMiddleware(options as Options, server));
  router.use(server.middlewares);

  return {
    bail,
    stats: { toJson: () => null },
    totalTime: process.hrtime(startTime),
  };
};

export const build: ViteBuilder['build'] = async ({ options }) => {
  const viteCompilation = viteBuild(options as Options);

  const previewResolvedDir = wrapForPnP('@junk-temporary-prototypes/preview');
  const previewDirOrigin = join(previewResolvedDir, 'dist');
  const previewDirTarget = join(options.outputDir || '', `sb-preview`);

  const previewFiles = fs.copy(previewDirOrigin, previewDirTarget, {
    filter: (src) => {
      const { ext } = parse(src);
      if (ext) {
        return ext === '.mjs';
      }
      return true;
    },
  });

  const [out] = await Promise.all([viteCompilation, previewFiles]);

  return out;
};
