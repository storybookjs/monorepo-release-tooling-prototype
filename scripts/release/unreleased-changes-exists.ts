/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import { z } from 'zod';
import { setOutput } from '@actions/core';
import { intersection } from 'lodash';
import type { Change } from './utils/get-changes';
import { getChanges } from './utils/get-changes';
import { getCurrentVersion } from './get-current-version';

program
  .name('are-changes-unreleased')
  .description('check if any changes since a release should be released')
  .option(
    '-F, --from <version>',
    'Which version/tag/commit to go back and check changes from. Defaults to latest release tag'
  )
  .option('-P, --unpicked-patches', 'Set to only consider PRs labeled with "patch" label')
  .option('-V, --verbose', 'Enable verbose logging', false);

const optionsSchema = z.object({
  from: z.string().optional(),
  unpickedPatches: z.boolean().optional(),
  verbose: z.boolean().optional(),
});

type Options = {
  from?: string;
  unpickedPatches?: boolean;
  verbose: boolean;
};

const validateOptions = (options: { [key: string]: any }): options is Options => {
  optionsSchema.parse(options);
  return true;
};

const LABELS_TO_RELEASE = ['BREAKING CHANGE', 'feature request', 'bug', 'maintenance'] as const;

export const run = async (
  options: unknown
): Promise<{ changesToRelease: Change[]; hasChangesToRelease: boolean }> => {
  if (!validateOptions(options)) {
    // this will never return because the validator throws
    return { changesToRelease: [], hasChangesToRelease: false };
  }
  const { from, unpickedPatches, verbose } = options;

  const currentVersion = await getCurrentVersion();

  console.log(
    `📐 Checking if there are any unreleased changes...`
  );

  const { changes } = await getChanges({
    version: currentVersion,
    from: from || currentVersion,
    to: 'HEAD',
    unpickedPatches,
    verbose,
  });

  const changesToRelease = changes
    .filter(({ labels }) => intersection(LABELS_TO_RELEASE, labels).length > 0);

  const hasChangesToRelease = changesToRelease.length > 0;

  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('has-changes-to-release', hasChangesToRelease);
  }
  if (hasChangesToRelease) {
    console.log(
      `${chalk.green('🦋 The following changes are releasable')}:
${chalk.blue(changesToRelease.map(({ title, pull }) => `  #${pull}: ${title}`).join('\n'))}`
    );
  } else {
    console.log(chalk.red('🫙 No changes to release!'));
  }

  return { changesToRelease, hasChangesToRelease };
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
