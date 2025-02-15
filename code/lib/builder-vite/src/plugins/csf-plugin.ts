import type { Plugin } from 'vite';
import { vite } from '@junk-temporary-prototypes/csf-plugin';
import type { StorybookConfig, Options } from '@junk-temporary-prototypes/types';

export async function csfPlugin(config: Options): Promise<Plugin> {
  const { presets } = config;

  const addons = await presets.apply<StorybookConfig['addons']>('addons', []);
  const docsOptions =
    // @ts-expect-error - not sure what type to use here
    addons.find((a) => [a, a.name].includes('@junk-temporary-prototypes/addon-docs'))?.options ?? {};

  return vite(docsOptions?.csfPluginOptions);
}
