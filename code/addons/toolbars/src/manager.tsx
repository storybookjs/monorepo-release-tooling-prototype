import React from 'react';
import { addons, types } from '@junk-temporary-prototypes/manager-api';
import { ToolbarManager } from './components/ToolbarManager';
import { ADDON_ID } from './constants';

addons.register(ADDON_ID, () =>
  addons.add(ADDON_ID, {
    title: ADDON_ID,
    id: 'toolbar',
    type: types.TOOL,
    match: () => true,
    render: () => <ToolbarManager />,
  })
);
