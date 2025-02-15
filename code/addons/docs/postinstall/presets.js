import fs from 'fs';
import { presetsAddPreset, getFrameworks } from '@junk-temporary-prototypes/postinstall';
import { logger } from '@junk-temporary-prototypes/node-logger';

export default function transformer(file, api) {
  const packageJson = JSON.parse(fs.readFileSync('./package.json'));
  const frameworks = getFrameworks(packageJson);

  let err = null;
  let framework = null;
  let presetOptions = null;
  if (frameworks.length !== 1) {
    err = `${frameworks.length === 0 ? 'No' : 'Multiple'} frameworks found: ${frameworks}`;
    logger.error(`${err}, please configure '@junk-temporary-prototypes/addon-docs' manually.`);
    return file.source;
  }

  // eslint-disable-next-line prefer-destructuring
  framework = frameworks[0];

  const { dependencies, devDependencies } = packageJson;
  if (
    framework === 'react' &&
    ((dependencies && dependencies['react-scripts']) ||
      (devDependencies && devDependencies['react-scripts']))
  ) {
    presetOptions = {};
  }

  const j = api.jscodeshift;
  const root = j(file.source);

  presetsAddPreset(`@junk-temporary-prototypes/addon-docs/preset`, presetOptions, { root, api });

  return root.toSource({ quote: 'single' });
}
