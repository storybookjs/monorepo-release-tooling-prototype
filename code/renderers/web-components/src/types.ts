import type { StoryContext as StoryContextBase, WebRenderer } from '@junk-temporary-prototypes/types';
import type { TemplateResult, SVGTemplateResult } from 'lit';

export type StoryFnHtmlReturnType = string | Node | TemplateResult | SVGTemplateResult;

export type StoryContext = StoryContextBase<WebComponentsRenderer>;

/**
 * @deprecated Use `WebComponentsRenderer` instead.
 */
export type WebComponentsFramework = WebComponentsRenderer;
export interface WebComponentsRenderer extends WebRenderer {
  component: string;
  storyResult: StoryFnHtmlReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}
