import type { WebRenderer } from '@junk-temporary-prototypes/types';
import type { AnyComponent } from 'preact';

export type { RenderContext } from '@junk-temporary-prototypes/types';

export type StoryFnPreactReturnType = string | Node | preact.JSX.Element;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

/**
 * @dep
 */
/**
 * @deprecated Use `PreactRenderer` instead.
 */
export type PreactFramework = PreactRenderer;
export interface PreactRenderer extends WebRenderer {
  component: AnyComponent<any, any>;
  storyResult: StoryFnPreactReturnType;
}
