import { global as globalThis } from '@storybook/global';
import { expect } from '@storybook/jest';
import type { PlayFunctionContext } from '@junk-temporary-prototypes/types';

export default {
  component: globalThis.Components.Pre,
  args: { text: 'No content' },
};

// Very simple stories to show what happens when one story's id is a prefix of another's
// Repro for https://github.com/storybookjs/storybook/issues/11571

export const PrefixAndName = {
  play: async ({ name }: PlayFunctionContext<any>) => {
    await expect(name).toBe('Prefix And Name');
  },
};

export const Prefix = {
  play: async ({ name }: PlayFunctionContext<any>) => {
    await expect(name).toBe('Prefix');
  },
};
