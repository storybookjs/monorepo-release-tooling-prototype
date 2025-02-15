import * as React from 'react';
import { addons, types } from '@junk-temporary-prototypes/manager-api';

import { ADDON_ID } from './constants';

import { ViewportTool } from './Tool';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'viewport / media-queries',
    id: 'viewport',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ViewportTool />,
  });
});
