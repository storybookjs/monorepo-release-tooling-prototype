import { useMemo, useEffect } from '@junk-temporary-prototypes/preview-api';
import type { Renderer, PartialStoryFn as StoryFunction, StoryContext } from '@junk-temporary-prototypes/types';

import { clearStyles, addOutlineStyles } from './helpers';
import { PARAM_KEY } from './constants';
import outlineCSS from './outlineCSS';

export const withOutline = (StoryFn: StoryFunction<Renderer>, context: StoryContext<Renderer>) => {
  const { globals } = context;
  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);
  const isInDocs = context.viewMode === 'docs';

  const outlineStyles = useMemo(() => {
    const selector = isInDocs ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

    return outlineCSS(selector);
  }, [context]);

  useEffect(() => {
    const selectorId = isInDocs ? `addon-outline-docs-${context.id}` : `addon-outline`;

    if (!isActive) {
      clearStyles(selectorId);
    } else {
      addOutlineStyles(selectorId, outlineStyles);
    }

    return () => {
      clearStyles(selectorId);
    };
  }, [isActive, outlineStyles, context]);

  return StoryFn();
};
