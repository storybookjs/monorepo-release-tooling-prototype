/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import { setOutput } from '@actions/core';
import path from 'path';
import { readJson } from 'fs-extra';

const CODE_DIR_PATH = path.join(__dirname, '..', '..', 'code');
const CODE_PACKAGE_JSON_PATH = path.join(CODE_DIR_PATH, 'package.json');

export const getCurrentVersion = async () => {
  console.log(`📐 Reading current version of Storybook...`);
  const { version } = (await readJson(CODE_PACKAGE_JSON_PATH)) as { version: string };
  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('current-version', version);
  }
  console.log(`📦 Current version is ${chalk.green(version)}`);
  return version;
};

if (require.main === module) {
  getCurrentVersion().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
