import { addons } from '@junk-temporary-prototypes/manager-api';

import EVENTS, { ADDON_ID } from './constants';

addons.register(ADDON_ID, (api) => {
  const channel = addons.getChannel();

  channel.on(EVENTS.REQUEST, ({ kind, name }) => {
    const id = api.storyId(kind, name);
    api.emit(EVENTS.RECEIVE, id);
  });
});
