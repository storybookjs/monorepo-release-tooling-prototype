import type {
  CoreCommon_AddonEntry,
  CoreCommon_AddonInfo,
  CoreCommon_OptionsEntry,
} from '@junk-temporary-prototypes/types';

import { logger } from '@junk-temporary-prototypes/node-logger';

interface Options {
  before: CoreCommon_AddonInfo;
  after: CoreCommon_AddonInfo;
  configFile: string;
  getConfig: (path: string) => any;
}

const predicateFor = (addon: string) => (entry: CoreCommon_AddonEntry) => {
  const name = (entry as CoreCommon_OptionsEntry).name || (entry as string);
  return name && name.includes(addon);
};

const isCorrectOrder = (
  addons: CoreCommon_AddonEntry[],
  before: CoreCommon_AddonInfo,
  after: CoreCommon_AddonInfo
) => {
  const essentialsIndex = addons.findIndex(predicateFor('@junk-temporary-prototypes/addon-essentials'));
  let beforeIndex = addons.findIndex(predicateFor(before.name));
  let afterIndex = addons.findIndex(predicateFor(after.name));
  if (beforeIndex === -1 && before.inEssentials) beforeIndex = essentialsIndex;
  if (afterIndex === -1 && after.inEssentials) afterIndex = essentialsIndex;
  return beforeIndex !== -1 && afterIndex !== -1 && beforeIndex <= afterIndex;
};

export const checkAddonOrder = async ({ before, after, configFile, getConfig }: Options) => {
  try {
    const config = await getConfig(configFile);

    if (!config?.addons) {
      logger.warn(`Unable to find 'addons' config in main Storybook config`);
      return;
    }

    if (!isCorrectOrder(config.addons, before, after)) {
      const orEssentials = " (or '@junk-temporary-prototypes/addon-essentials')";
      const beforeText = `'${before.name}'${before.inEssentials ? orEssentials : ''}`;
      const afterText = `'${after.name}'${after.inEssentials ? orEssentials : ''}`;
      logger.warn(
        `Expected ${beforeText} to be listed before ${afterText} in main Storybook config.`
      );
    }
  } catch (e) {
    logger.warn(`Unable to load config file: ${configFile}`);
  }
};
