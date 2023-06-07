/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import { z } from 'zod';
import dedent from 'ts-dedent';
import { setOutput } from '@actions/core';
import type { Change } from './utils/get-changes';
import { getChanges } from './utils/get-changes';
import { getCurrentVersion } from './get-current-version';

program
  .name('generate-pr-description')
  .description('generate a PR description for a release')
  .option(
    '-C, --current-version <version>',
    'Which version to generate changelog from, eg. "7.0.7". Defaults to the version at code/package.json'
  )
  .option('-N, --next-version <version>', 'Which version to generate changelog to, eg. "7.0.8"')
  .option('-P, --unpicked-patches', 'Set to only consider PRs labeled with "patch" label')
  .option(
    '-M, --manual-cherry-picks <commits>',
    'A stringified JSON array of commit hashes, of patch PRs that needs to be cherry-picked manually'
  )
  .option('-V, --verbose', 'Enable verbose logging', false);

const optionsSchema = z.object({
  currentVersion: z.string().optional(),
  nextVersion: z.string().optional(),
  unpickedPatches: z.boolean().optional(),
  manualCherryPicks: z
    .string()
    .default('[]')
    .transform((val) => JSON.parse(val))
    .refine((val) => Array.isArray(val)),
  verbose: z.boolean().optional(),
});

type Options = {
  currentVersion?: string;
  nextVersion?: string;
  unpickedPatches?: boolean;
  manualCherryPicks?: string[];
  verbose: boolean;
};

const LABELS_BY_IMPORTANCE = {
  'BREAKING CHANGE': '❗ Breaking Change',
  'feature request': '✨ Feature Request',
  bug: '🐛 Bug',
  maintenance: '🔧 Maintenance',
  documentation: '📝 Documentation',
  build: '🏗️ Build',
  unknown: '❔ Missing Label',
} as const;

const CHANGE_TITLES_TO_IGNORE = [/^bump version on.*/i, /^merge branch.*/i];

export const mapToChangelist = ({
  changes,
  isRelease,
}: {
  changes: Change[];
  isRelease: boolean;
}): string => {
  return changes
    .filter((change) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const titleToIgnore of CHANGE_TITLES_TO_IGNORE) {
        if (change.title.match(titleToIgnore)) {
          return false;
        }
      }
      return true;
    })
    .map((change) => {
      const lines: string[] = [];
      if (!change.pull) {
        lines.push(`- **⚠️ Direct commit**: ${change.title} ${change.links.commit}`);
        if (isRelease) {
          lines.push('\t- [ ] The change is appropriate for the version bump');
        }
        return lines.join('\n');
      }

      const label = (change.labels
        ?.filter((l) => Object.keys(LABELS_BY_IMPORTANCE).includes(l))
        .sort(
          (a, b) =>
            Object.keys(LABELS_BY_IMPORTANCE).indexOf(a) -
            Object.keys(LABELS_BY_IMPORTANCE).indexOf(b)
        )[0] || 'unknown') as keyof typeof LABELS_BY_IMPORTANCE;

      lines.push(`- **${LABELS_BY_IMPORTANCE[label]}**: ${change.title} ${change.links.pull}`);

      if (isRelease) {
        lines.push('\t- [ ] The change is appropriate for the version bump');
        lines.push('\t- [ ] The PR is labeled correctly');
        lines.push('\t- [ ] The PR title is correct');
      }
      return lines.join('\n');
    })
    .join('\n');
};

export const mapCherryPicksToTodo = ({
  commits,
  changes,
  verbose,
}: {
  commits: string[];
  changes: Change[];
  verbose?: boolean;
}): string => {
  const list = commits
    .map((commit) => {
      const change = changes.find((change) => change.commit === commit.substring(0, 7));
      if (!change) {
        throw new Error(
          `Cherry pick commit "${commit}" not found in changes, this should not happen?!`
        );
      }
      return `- [ ] ${change.links.pull}: \`git cherry-pick -m1 -x ${commit}\``;
    })
    .join('\n');

  if (verbose) {
    console.log(`🍒 Cherry pick list:\n${list}`);
  }
  return dedent`## 🍒 Manual cherry picking needed!

  The following pull requests could not be cherry-picked automatically because it resulted in merge conflicts.
  For each pull request below, you need to either manually cherry pick it, or discard it by removing the "patch" label from the PR and re-generate this PR.
  
  ${list}`;
};

export const generateReleaseDescription = ({
  currentVersion,
  nextVersion,
  changeList,
  changelogText,
  manualCherryPicks,
}: {
  currentVersion: string;
  nextVersion: string;
  changeList: string;
  changelogText: string;
  manualCherryPicks?: string;
}): string => {
  return (
    dedent`This is an automated pull request that bumps the version from \`${currentVersion}\` to \`${nextVersion}\`.
  Once this pull request is merged, it will trigger a new release of version \`${nextVersion}\`.
  If you're not a core maintainer with permissions to release you can ignore this pull request.

  ## To do

  Before merging the PR, there are a few QA steps to go through:

  - [ ] Add the "freeze" label to this PR, to ensure it doesn't get automatically forced pushed by new changes.
  
  And for each change below:
  
  1. Ensure the change is appropriate for the version bump. E.g. patch release should only contain patches, not new or de-stabilizing features. If a change is not appropriate, revert the PR.
  2. Ensure the PR is labeled correctly with "BREAKING CHANGE", "feature request", "maintainance", "bug", "build" or "documentation".
  3. Ensure the PR title is correct, and follows the format "[Area]: [Summary]", e.g. *"React: Fix hooks in CSF3 render functions"*. If it is not correct, change the title in the PR.
      - Areas include: React, Vue, Core, Docs, Controls, etc.
      - First word of summary indicates the type: “Add”, “Fix”, “Upgrade”, etc.
      - The entire title should fit on a line
  
  This is a list of all the PRs merged and commits pushed directly to \`next\`, that will be part of this release:
  
  ${changeList}

  ${manualCherryPicks ? manualCherryPicks : ''}

  If you've made any changes doing the above QA (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish. It will wipe your progress in this to do, which is expected.
  
  When everything above is done:
  - [ ] Merge this PR
  - [ ] [Follow the publish workflow run and see it finishes succesfully](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)
  
  ---
  
  # Generated changelog
  
  ${changelogText}`
      // don't mention contributors in the release PR, to avoid spamming them
      .replaceAll('[@', '[@ ')
      .replaceAll('"', '\\"')
      .replaceAll('`', '\\`')
      .replaceAll("'", "\\'")
  );
};

export const generateNonReleaseDescription = (
  changeList: string,
  manualCherryPicks?: string
): string => {
  return (
    dedent`This is an automated pull request. None of the changes requires a version bump, they are only internal or documentation related. Merging this PR will not trigger a new release, but documentation will be updated.
  If you're not a core maintainer with permissions to release you can ignore this pull request.
  
  This is a list of all the PRs merged and commits pushed directly to \`next\` since the last release:
  
  ${changeList}

  ${manualCherryPicks ? manualCherryPicks : ''}

  If you've made any changes (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish.
  
  When everything above is done:
  - [ ] Merge this PR
  - [ ] [Approve the publish workflow run](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)`
      // don't mention contributors in the release PR, to avoid spamming them
      .replaceAll('[@', '[@ ')
      .replaceAll('"', '\\"')
      .replaceAll('`', '\\`')
      .replaceAll("'", "\\'")
  );
};

export const run = async (rawOptions: unknown) => {
  const { nextVersion, unpickedPatches, verbose, manualCherryPicks, ...options } =
    optionsSchema.parse(rawOptions) as Options;

  if (!nextVersion) {
    console.log(
      '🚨 --next-version option not specified, generating PR description assuming no release is needed'
    );
  }

  const currentVersion = options.currentVersion || (await getCurrentVersion());

  console.log(
    `💬 Generating PR description for ${chalk.blue(nextVersion)} between ${chalk.green(
      currentVersion
    )} and ${chalk.green('HEAD')}`
  );

  const { changes, changelogText } = await getChanges({
    version: nextVersion,
    from: `v${currentVersion}`,
    to: 'HEAD',
    unpickedPatches,
    verbose,
  });

  const hasCherryPicks = manualCherryPicks?.length > 0;

  const description = nextVersion
    ? generateReleaseDescription({
        currentVersion,
        nextVersion,
        changeList: mapToChangelist({ changes, isRelease: true }),
        changelogText,
        ...(hasCherryPicks && {
          manualCherryPicks: mapCherryPicksToTodo({
            commits: manualCherryPicks,
            changes,
            verbose,
          }),
        }),
      })
    : generateNonReleaseDescription(
        mapToChangelist({ changes, isRelease: false }),
        hasCherryPicks ? mapCherryPicksToTodo({
          commits: manualCherryPicks,
          changes,
          verbose,
        }) : undefined
      );

  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('description', description);
  }
  console.log(`✅ Generated PR description for ${chalk.blue(nextVersion)}`);
  if (verbose) {
    console.log(description);
  }
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
