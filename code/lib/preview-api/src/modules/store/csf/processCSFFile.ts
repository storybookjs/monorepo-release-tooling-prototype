import type {
  Renderer,
  ComponentTitle,
  Parameters,
  Path,
  CSFFile,
  ModuleExports,
  NormalizedComponentAnnotations,
} from '@junk-temporary-prototypes/types';
import { isExportStory } from '@storybook/csf';
import { deprecate, logger } from '@junk-temporary-prototypes/client-logger';

import dedent from 'ts-dedent';
import { normalizeStory } from './normalizeStory';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';

const checkGlobals = (parameters: Parameters) => {
  const { globals, globalTypes } = parameters;
  if (globals || globalTypes) {
    logger.error(
      'Global args/argTypes can only be set globally',
      JSON.stringify({
        globals,
        globalTypes,
      })
    );
  }
};

const checkStorySort = (parameters: Parameters) => {
  const { options } = parameters;
  if (options?.storySort) logger.error('The storySort option parameter can only be set globally');
};

const checkDisallowedParameters = (parameters?: Parameters) => {
  if (!parameters) return;

  checkGlobals(parameters);
  checkStorySort(parameters);
};

const checkSubcomponents = (meta: ModuleExports) => {
  if (meta.subcomponents) {
    deprecate(dedent`The \`subcomponents\` annotation is deprecated. 
    
      Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#argstable-block'
    `);
  }
};

// Given the raw exports of a CSF file, check and normalize it.
export function processCSFFile<TRenderer extends Renderer>(
  moduleExports: ModuleExports,
  importPath: Path,
  title: ComponentTitle
): CSFFile<TRenderer> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { default: defaultExport, __namedExportsOrder, ...namedExports } = moduleExports;

  const meta: NormalizedComponentAnnotations<TRenderer> = normalizeComponentAnnotations<TRenderer>(
    defaultExport,
    title,
    importPath
  );
  checkDisallowedParameters(meta.parameters);
  checkSubcomponents(meta);

  const csfFile: CSFFile<TRenderer> = { meta, stories: {}, moduleExports };

  Object.keys(namedExports).forEach((key) => {
    if (isExportStory(key, meta)) {
      const storyMeta = normalizeStory(key, namedExports[key], meta);
      checkDisallowedParameters(storyMeta.parameters);

      csfFile.stories[storyMeta.id] = storyMeta;
    }
  });

  return csfFile;
}
