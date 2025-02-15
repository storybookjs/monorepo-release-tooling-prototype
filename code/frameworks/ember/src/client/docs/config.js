import { enhanceArgTypes } from '@junk-temporary-prototypes/docs-tools';
import { extractArgTypes, extractComponentDescription } from './jsondoc';

export const parameters = {
  docs: {
    story: { iframeHeight: '80px' },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const argTypesEnhancers = [enhanceArgTypes];
