import React, { useCallback, useEffect } from 'react';
import { useGlobals, useStorybookApi } from '@junk-temporary-prototypes/manager-api';
import { Icons, IconButton } from '@junk-temporary-prototypes/components';
import { TOOL_ID, ADDON_ID } from './constants';

export const Tool = () => {
  const [globals, updateGlobals] = useGlobals();
  const { measureEnabled } = globals;
  const api = useStorybookApi();

  const toggleMeasure = useCallback(
    () =>
      updateGlobals({
        measureEnabled: !measureEnabled,
      }),
    [updateGlobals, measureEnabled]
  );

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Measure [M]',
      defaultShortcut: ['M'],
      actionName: 'measure',
      showInMenu: false,
      action: toggleMeasure,
    });
  }, [toggleMeasure, api]);

  return (
    <IconButton
      key={TOOL_ID}
      active={measureEnabled}
      title="Enable measure"
      onClick={toggleMeasure}
    >
      <Icons icon="ruler" />
    </IconButton>
  );
};
