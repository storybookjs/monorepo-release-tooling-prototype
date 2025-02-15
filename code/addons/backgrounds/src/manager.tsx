import React, { Fragment } from 'react';
import { addons, types } from '@junk-temporary-prototypes/manager-api';

import { ADDON_ID } from './constants';
import { BackgroundSelector } from './containers/BackgroundSelector';
import { GridSelector } from './containers/GridSelector';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Backgrounds',
    id: 'backgrounds',
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => (
      <Fragment>
        <BackgroundSelector />
        <GridSelector />
      </Fragment>
    ),
  });
});
