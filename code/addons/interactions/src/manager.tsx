import { addons, types } from '@junk-temporary-prototypes/manager-api';

import { ADDON_ID, PANEL_ID } from './constants';
import { Panel } from './Panel';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Interactions',
    match: ({ viewMode }) => viewMode === 'story',
    render: Panel,
  });
});
