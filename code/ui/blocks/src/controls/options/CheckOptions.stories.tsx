import type { Meta, StoryObj } from '@junk-temporary-prototypes/react';
import { OptionsControl } from './Options';

const arrayOptions = ['Bat', 'Cat', 'Rat'];
const labels = {
  Bat: 'Batwoman',
  Cat: 'Catwoman',
  Rat: 'Ratwoman',
};
const objectOptions = {
  A: { id: 'Aardvark' },
  B: { id: 'Bat' },
  C: { id: 'Cat' },
};

const meta = {
  title: 'Controls/Options/Check',
  component: OptionsControl,
  tags: ['autodocs'],
  parameters: {
    withRawArg: 'value',
    controls: { include: ['argType', 'type', 'value', 'labels'] },
  },
  args: {
    name: 'check',
    type: 'check',
    argType: { options: arrayOptions },
  },
  argTypes: {
    value: {
      control: { type: 'check' },
      options: arrayOptions,
    },
  },
} as Meta<typeof OptionsControl>;

export default meta;

export const Array: StoryObj<typeof OptionsControl> = {
  args: {
    value: [arrayOptions[0]],
  },
};

export const ArrayInline: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'inline-check',
    value: [arrayOptions[1], arrayOptions[2]],
  },
};

export const ArrayLabels: StoryObj<typeof OptionsControl> = {
  args: {
    value: [arrayOptions[0]],
    labels,
  },
};

export const ArrayInlineLabels: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'inline-check',
    value: [arrayOptions[1], arrayOptions[2]],
    labels,
  },
};

export const ArrayUndefined: StoryObj<typeof OptionsControl> = {
  args: {
    value: undefined,
  },
};

export const Object: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object',
  args: {
    value: [objectOptions.B],
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};

export const ObjectInline: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Inline',
  args: {
    type: 'inline-check',
    value: [objectOptions.A, objectOptions.C],
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};

export const ObjectUndefined: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Undefined',
  args: {
    value: undefined,
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};
