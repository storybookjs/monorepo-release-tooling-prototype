import type { Meta, StoryObj } from '@junk-temporary-prototypes/react';
import { Anchor } from './Anchor';

const meta = {
  component: Anchor,
  parameters: {
    docsStyles: true,
  },
} as Meta<typeof Anchor>;

export default meta;

export const Default: StoryObj<typeof Anchor> = {
  args: {
    children: 'This is an anchor for storyId: "default"',
    storyId: 'default',
  },
};
