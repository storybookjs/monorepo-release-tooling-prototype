/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import { setOutput } from '@actions/core';
import fetch from 'node-fetch';
import { getCurrentVersion } from './get-current-version';

program
  .name('is-prerelease [version]')
  .description('returns true if the current version is a prerelease')
  .arguments('[version]');

const isVersionPublished = async ({
  packageName,
  version,
  verbose,
}: {
  packageName: string;
  version: string;
  verbose?: boolean;
}) => {
  const prettyPackage = `${chalk.blue(packageName)}@${chalk.green(version)}`;
  console.log(`⛅ Checking if ${prettyPackage} is published...`);

  if (verbose) {
    console.log(`Fetching from npm:`);
    console.log(`https://registry.npmjs.org/${chalk.blue(packageName)}/${chalk.green(version)}`);
  }
  const response = await fetch(`https://registry.npmjs.org/${packageName}/${version}`);
  if (response.status === 404) {
    console.log(`🌤️ ${prettyPackage} is not published`);
    return false;
  }
  if (response.status !== 200) {
    console.error(
      `Unexpected status code when checking the current version on npm: ${response.status}`
    );
    console.error(await response.text());
    throw new Error(
      `Unexpected status code when checking the current version on npm: ${response.status}`
    );
  }
  const data = await response.json();
  if (verbose) {
    console.log(`Response from npm:`);
    console.log(data);
  }
  if (data.version !== version) {
    // this should never happen
    console.error(
      `Unexpected version received when checking the current version on npm: ${data.version}`
    );
    console.error(JSON.stringify(data, null, 2));
    throw new Error(
      `Unexpected version received when checking the current version on npm: ${data.version}`
    );
  }

  console.log(`⛈️ ${prettyPackage} is published`);
  return true;
};

export const run = async (args: unknown[], options: unknown) => {
  const { verbose } = options as { verbose?: boolean };

  const version = (args[0] as string) || (await getCurrentVersion());

  const isAlreadyPublished = await isVersionPublished({
    version,
    packageName: '@junk-temporary-prototypes/manager-api',
    verbose,
  });

  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('published', isAlreadyPublished);
  }
  return isAlreadyPublished;
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.args, parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
