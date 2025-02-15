import path from 'path';
import pluginTurbosnap from 'vite-plugin-turbosnap';
import { mergeConfig } from 'vite';
import type { StorybookConfig } from '../../frameworks/react-vite';

const isBlocksOnly = process.env.STORYBOOK_BLOCKS_ONLY === 'true';

const allStories = [
  '../../lib/cli/rendererAssets/common/Introduction.stories.mdx',
  {
    directory: '../manager/src',
    titlePrefix: '@junk-temporary-prototypes-manager',
  },
  {
    directory: '../components/src',
    titlePrefix: '@junk-temporary-prototypes-components',
  },
  {
    directory: '../blocks/src',
    titlePrefix: '@junk-temporary-prototypes-blocks',
  },
];

/**
 * match all stories in blocks/src/blocks, blocks/src/controls and blocks/src/examples EXCEPT blocks/src/blocks/internal
 * Examples:
 *
 * src/blocks/Canvas.stories.tsx - MATCH
 * src/blocks/internal/InternalCanvas.stories.tsx - IGNORED, internal stories
 * src/blocks/internal/nested/InternalCanvas.stories.tsx - IGNORED, internal stories
 *
 * src/blocks/Canvas.tsx - IGNORED, not story
 * src/blocks/nested/Canvas.stories.tsx - MATCH
 * src/blocks/nested/deep/Canvas.stories.tsx - MATCH
 *
 * src/controls/Boolean.stories.tsx - MATCH
 * src/controls/Boolean.tsx - IGNORED, not story
 *
 * src/components/ColorPalette.stories.tsx - MATCH
 * src/components/ColorPalette.tsx - IGNORED, not story
 */
const blocksOnlyStories = [
  '../blocks/src/@(blocks|controls|examples)/!(internal)/**/*.@(mdx|stories.@(tsx|ts|jsx|js))',
  '../blocks/src/@(blocks|controls|examples)/*.@(mdx|stories.@(tsx|ts|jsx|js))',
];

const config: StorybookConfig = {
  stories: isBlocksOnly ? blocksOnlyStories : allStories,
  addons: [
    '@junk-temporary-prototypes/addon-links',
    '@junk-temporary-prototypes/addon-essentials',
    '@junk-temporary-prototypes/addon-interactions',
    '@junk-temporary-prototypes/addon-storysource',
  ],
  framework: {
    name: '@junk-temporary-prototypes/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: (viteConfig, { configType }) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: {
          ...(configType === 'DEVELOPMENT'
            ? { '@junk-temporary-prototypes/components': path.resolve(__dirname, '../components/src') }
            : {}),
        },
      },
      plugins: [
        configType === 'PRODUCTION'
          ? pluginTurbosnap({ rootDir: path.resolve(__dirname, '../..') })
          : [],
      ],
      optimizeDeps: { force: true },
      build: {
        // disable sourcemaps in CI to not run out of memory
        sourcemap: process.env.CI !== 'true',
      },
    }),
  logLevel: 'debug',
};

export default config;
