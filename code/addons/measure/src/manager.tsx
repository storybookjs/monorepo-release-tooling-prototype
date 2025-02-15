import React from 'react';
import { addons, types } from '@junk-temporary-prototypes/manager-api';

import { ADDON_ID, TOOL_ID } from './constants';
import { Tool } from './Tool';

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    id: 'measure',
    title: 'Measure',
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <Tool />,
  });
});
