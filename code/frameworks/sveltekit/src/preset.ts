// @ts-expect-error -- TS picks up the type from preset.js instead of dist/preset.d.ts
import { viteFinal as svelteViteFinal } from '@junk-temporary-prototypes/svelte-vite/preset';
import type { PresetProperty } from '@junk-temporary-prototypes/types';
import { withoutVitePlugins } from '@junk-temporary-prototypes/builder-vite';
import { configOverrides } from './plugins/config-overrides';
import { type StorybookConfig } from './types';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@junk-temporary-prototypes/builder-vite',
  renderer: '@junk-temporary-prototypes/svelte',
};

export const viteFinal: NonNullable<StorybookConfig['viteFinal']> = async (config, options) => {
  const baseConfig = await svelteViteFinal(config, options);

  let { plugins = [] } = baseConfig;

  // disable specific plugins that are not compatible with Storybook
  plugins = (
    await withoutVitePlugins(plugins, [
      'vite-plugin-sveltekit-compile',
      'vite-plugin-sveltekit-guard',
    ])
  ).concat(configOverrides());

  return { ...baseConfig, plugins };
};
