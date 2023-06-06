/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import { simpleGit } from 'simple-git';
import { setOutput } from '@actions/core';
import path from 'path';
import { readJson } from 'fs-extra';
import { getPullInfoFromCommit } from './utils/get-github-info';

program
  .name('is-pr-frozen')
  .description(
    'returns true if the versioning pull request associated with the current branch has the "freeze" label'
  )
  .option('-P, --patch', 'Look for patch PR instead of prerelease PR', false)
  .option('-V, --verbose', 'Enable verbose logging', false);

const git = simpleGit();

const CODE_DIR_PATH = path.join(__dirname, '..', '..', 'code');
const CODE_PACKAGE_JSON_PATH = path.join(CODE_DIR_PATH, 'package.json');

const getCurrentVersion = async () => {
  console.log(`📐 Reading current version of Storybook...`);
  const { version } = await readJson(CODE_PACKAGE_JSON_PATH);
  return version;
};

const getRepo = async (verbose?: boolean): Promise<string> => {
  const remotes = await git.getRemotes(true);
  const originRemote = remotes.find((remote) => remote.name === 'origin');
  if (!originRemote) {
    console.error(
      'Could not determine repository URL because no remote named "origin" was found. Remotes found:'
    );
    console.dir(remotes, { depth: null, colors: true });
    throw new Error('No remote named "origin" found');
  }
  const pushUrl = originRemote.refs.push;
  const repo = pushUrl.replace(/\.git$/, '').replace(/.*:(\/\/github\.com\/)*/, '');
  if (verbose) {
    console.log(`📦 Extracted repo: ${chalk.blue(repo)}`);
  }
  return repo;
};

export const run = async (options: unknown) => {
  const { verbose, patch } = options as { verbose?: boolean; patch?: boolean };

  const version = await getCurrentVersion();
  const branch = `version-from-${patch ? 'patch' : 'prerelease'}-${version}`;

  console.log(`💬 Determining if pull request from branch '${chalk.blue(branch)}' is frozen`);

  console.log(`⬇️ Fetching remote 'origin/${branch}'...`);
  try {
    await git.fetch('origin', branch, { '--depth': 1 });
  } catch (error) {
    console.warn(
      `❗ Could not fetch remote 'origin/${branch}', it probably does not exist yet, which is okay`
    );
    console.warn(error);
    console.log(`💧 Pull request doesn't exist yet! 😎`);
    if (process.env.GITHUB_ACTIONS === 'true') {
      setOutput('frozen', false);
    }
    return false;
  }

  const commit = await git.revparse(`origin/${branch}`);
  console.log(`🔍 Found commit: ${commit}`);

  const repo = await getRepo(verbose);

  const pullRequest = await getPullInfoFromCommit({ repo, commit }).catch((err) => {
    console.error(`🚨 Could not get pull requests from commit: ${commit}`);
    console.error(err);
    throw err;
  });
  console.log(`🔍 Found pull request:
  ${JSON.stringify(pullRequest, null, 2)}`);

  const isFrozen = pullRequest.labels?.includes('freeze');
  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('frozen', isFrozen);
  }
  if (isFrozen) {
    console.log(`🧊 Pull request is frozen! 🥶`);
  } else {
    console.log(`🔥 Pull request is on fire! 🥵`);
  }
  return isFrozen;
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
