import { global } from '@storybook/global';
import React from 'react';
import { getStoryHref, IconButton, Icons } from '@junk-temporary-prototypes/components';
import { Consumer } from '@junk-temporary-prototypes/manager-api';
import type { Addon, Combo } from '@junk-temporary-prototypes/manager-api';

const { PREVIEW_URL } = global;

const ejectMapper = ({ state }: Combo) => {
  const { storyId, refId, refs } = state;
  const ref = refs[refId];

  return {
    refId,
    baseUrl: ref ? `${ref.url}/iframe.html` : (PREVIEW_URL as string) || 'iframe.html',
    storyId,
    queryParams: state.customQueryParams,
  };
};

export const ejectTool: Addon = {
  title: 'eject',
  id: 'eject',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={ejectMapper}>
      {({ baseUrl, storyId, queryParams }) =>
        storyId ? (
          <IconButton
            key="opener"
            href={getStoryHref(baseUrl, storyId, queryParams)}
            target="_blank"
            title="Open canvas in new tab"
          >
            <Icons icon="sharealt" />
          </IconButton>
        ) : null
      }
    </Consumer>
  ),
};
