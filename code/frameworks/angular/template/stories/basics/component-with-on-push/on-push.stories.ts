import { Meta, StoryFn } from '@junk-temporary-prototypes/angular';
import { OnPushBoxComponent } from './on-push-box.component';

export default {
  // title: 'Basics / Component / With OnPush strategy',
  component: OnPushBoxComponent,
  argTypes: {
    word: { control: 'text' },
    bgColor: { control: 'color' },
  },
  args: {
    word: 'The text',
    bgColor: '#FFF000',
  },
} as Meta;

export const ClassSpecifiedComponentWithOnPushAndArgs: StoryFn = (args) => ({
  props: args,
});
ClassSpecifiedComponentWithOnPushAndArgs.storyName =
  'Class-specified component with OnPush and Args';
