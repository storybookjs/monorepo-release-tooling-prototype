import type { PluginOption } from 'vite';
import type { Options } from '@junk-temporary-prototypes/types';
import dedent from 'ts-dedent';
import { logger } from '@junk-temporary-prototypes/node-logger';
import { hasVitePlugins } from '@junk-temporary-prototypes/builder-vite';

/**
 * A migration step that ensures the svelte-vite framework still supports SvelteKit,
 * but warns the user that they should use the sveltekit framework instead.
 * Should be removed when we decide to remove support completely for SvelteKit in svelte-vite
 */
export async function handleSvelteKit(plugins: PluginOption[], options: Options) {
  /*
  the sveltekit framework uses this svelte-vite framework under the hood
  so we have to take extra care of only throwing when the user is actually using
  svelte-vite directly and not just through sveltekit
  */
  const frameworkPreset = await options.presets.apply('framework', {}, options);
  const framework = typeof frameworkPreset === 'string' ? frameworkPreset : frameworkPreset.name;

  const hasSvelteKitPlugins = await hasVitePlugins(plugins, [
    'vite-plugin-svelte-kit',
    'vite-plugin-sveltekit-setup',
    'vite-plugin-sveltekit-compile',
  ]);

  if (hasSvelteKitPlugins && framework !== '@junk-temporary-prototypes/sveltekit') {
    logger.error(
      dedent`
      We've detected a SvelteKit project using the @junk-temporary-prototypes/svelte-vite framework, which is not supported in Storybook 7.0
      Please use the @junk-temporary-prototypes/sveltekit framework instead.
      You can migrate automatically by running
      
      npx storybook@latest automigrate

      See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#sveltekit-needs-the-storybooksveltekit-framework
      `
    );
    throw new Error();
  }
}
