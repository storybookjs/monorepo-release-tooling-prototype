import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations,
} from '@junk-temporary-prototypes/types';

import type { ComponentProps, ComponentType, SvelteComponentTyped } from 'svelte';
import type { SetOptional, Simplify } from 'type-fest';
import type { SvelteRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@junk-temporary-prototypes/types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends SvelteComponentTyped<infer Props>
  ? ComponentAnnotations<SvelteRenderer<CmpOrArgs>, Props>
  : ComponentAnnotations<SvelteRenderer, CmpOrArgs>;
/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TCmpOrArgs = Args> = TCmpOrArgs extends SvelteComponentTyped<infer Props>
  ? AnnotatedStoryFn<SvelteRenderer, Props>
  : AnnotatedStoryFn<SvelteRenderer, TCmpOrArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<MetaOrCmpOrArgs = Args> = MetaOrCmpOrArgs extends {
  render?: ArgsStoryFn<SvelteRenderer, any>;
  component?: ComponentType<infer Component>;
  args?: infer DefaultArgs;
}
  ? Simplify<
      ComponentProps<Component> & ArgsFromMeta<SvelteRenderer, MetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        SvelteRenderer<Component>,
        TArgs,
        SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>
      >
    : never
  : MetaOrCmpOrArgs extends SvelteComponentTyped
  ? StoryAnnotations<SvelteRenderer<MetaOrCmpOrArgs>, ComponentProps<MetaOrCmpOrArgs>>
  : StoryAnnotations<SvelteRenderer, MetaOrCmpOrArgs>;

export type { SvelteRenderer };
export type Decorator<TArgs = StrictArgs> = DecoratorFunction<SvelteRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<SvelteRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<SvelteRenderer, TArgs>;
export type Preview = ProjectAnnotations<SvelteRenderer>;
