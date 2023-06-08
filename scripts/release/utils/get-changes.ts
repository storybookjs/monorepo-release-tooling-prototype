/* eslint-disable no-console */
import chalk from 'chalk';
import semver from 'semver';
import type { PullRequestInfo } from './get-github-info';
import { getPullInfoFromCommit } from './get-github-info';
import { getUnpickedPRs } from './get-unpicked-prs';
import { git } from './git-client';

const LABELS_FOR_CHANGELOG = ['BREAKING CHANGE', 'feature request', 'bug', 'maintenance'];

const getCommitAt = async (id: string, verbose?: boolean) => {
  if (!semver.valid(id)) {
    console.log(`🔍 ${chalk.red(id)} is not a valid semver string, assuming it is a commit hash`);
    return id;
  }
  const version = id.startsWith('v') ? id : `v${id}`;
  const commitSha = (await git.raw(['rev-list', '-n', '1', version])).split('\n')[0];
  if (verbose) {
    console.log(`🔍 Commit at tag ${chalk.green(version)}: ${chalk.blue(commitSha)}`);
  }
  return commitSha;
};

export const getFromCommit = async (from?: string | undefined, verbose?: boolean) => {
  let actualFrom = from;
  if (!from) {
    console.log(`🔍 No 'from' specified, finding latest version tag, fetching all of them...`);
    // await git.fetch('origin', ['--all', '--tags']);
    const { latest } = await git.tags(['v*', '--sort=-v:refname', '--merged']);
    if (!latest) {
      throw new Error(
        'Could not automatically detect which commit to generate from, because no version tag was found in the history. Have you fetch tags?'
      );
    }
    actualFrom = latest;
    if (verbose) {
      console.log(`🔍 No 'from' specified, found latest tag: ${chalk.blue(latest)}`);
    }
  }
  const commit = await getCommitAt(actualFrom, verbose);
  if (verbose) {
    console.log(`🔍 Found 'from' commit: ${chalk.blue(commit)}`);
  }
  return commit;
};

export const getToCommit = async (to?: string | undefined, verbose?: boolean) => {
  if (!to) {
    const head = await git.revparse('HEAD');
    if (verbose) {
      console.log(`🔍 No 'to' specified, HEAD is at commit: ${chalk.blue(head)}`);
    }
    return head;
  }

  const commit = await getCommitAt(to, verbose);
  if (verbose) {
    console.log(`🔍 Found 'to' commit: ${chalk.blue(commit)}`);
  }
  return commit;
};

export const getAllCommitsBetween = async ({
  from,
  to,
  verbose,
}: {
  from: string;
  to?: string;
  verbose?: boolean;
}) => {
  const logResult = await git.log({ from, to });
  if (verbose) {
    console.log(
      `🔍 Found ${chalk.blue(logResult.total)} commits between ${chalk.green(
        `${from}`
      )} and ${chalk.green(`${to}`)}:`
    );
    console.dir(logResult.all, { depth: null, colors: true });
  }
  return logResult.all;
};

export const getRepo = async (verbose?: boolean): Promise<string> => {
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

export const getPullInfoFromCommits = async ({
  repo,
  commits,
  verbose,
}: {
  repo: string;
  commits: readonly { hash: string }[];
  verbose?: boolean;
}): Promise<PullRequestInfo[]> => {
  const pullRequests = await Promise.all(
    commits.map((commit) =>
      getPullInfoFromCommit({
        repo,
        commit: commit.hash,
      })
    )
  );
  if (verbose) {
    console.log(`🔍 Found pull requests:`);
    console.dir(pullRequests, { depth: null, colors: true });
  }
  return pullRequests;
};

export type Change = PullRequestInfo;

export const mapToChanges = ({
  commits,
  pullRequests,
  unpickedPatches,
  verbose,
}: {
  commits: readonly { hash: string; message?: string }[];
  pullRequests: PullRequestInfo[];
  unpickedPatches?: boolean;
  verbose?: boolean;
}): Change[] => {
  if (pullRequests.length !== commits.length) {
    // not all commits are associated with a pull request, but the pullRequests array should still contain those commits
    console.error('Pull requests and commits are not the same length, this should not happen');
    console.error(`Pull Requests: ${pullRequests.length}`);
    console.dir(pullRequests, { depth: null, colors: true });
    console.error(`Commits: ${commits.length}`);
    console.dir(commits, { depth: null, colors: true });
    throw new Error('Pull requests and commits are not the same length, this should not happen');
  }
  const allEntries = pullRequests.map((pr, index) => {
    return {
      ...pr,
      title: pr.title || commits[index].message,
    };
  });

  const changes: Change[] = [];
  allEntries.forEach((entry) => {
    // filter out any duplicate entries, eg. when multiple commits are associated with the same pull request
    if (entry.pull && changes.findIndex((existing) => entry.pull === existing.pull) !== -1) {
      return;
    }
    // filter out any entries that are not patches if unpickedPatches is set. this will also filter out direct commits
    if (unpickedPatches && !entry.labels?.includes('patch')) {
      return;
    }
    changes.push(entry);
  });

  if (verbose) {
    console.log(`📝 Generated changelog entries:`);
    console.dir(changes, { depth: null, colors: true });
  }
  return changes;
};

export const getChangelogText = ({
  changes,
  version,
}: {
  changes: Change[];
  version: string;
}): string => {
  const heading = `## ${version}`;
  const formattedEntries = changes
    .filter((entry) => {
      // don't include direct commits that are not from pull requests
      if (!entry.pull) {
        return false;
      }
      // only include PRs that with labels listed in LABELS_FOR_CHANGELOG
      return entry.labels?.some((label) => LABELS_FOR_CHANGELOG.includes(label));
    })
    .map((entry) => {
      const { title, links } = entry;
      const { pull, commit, user } = links;
      return pull
        ? `- ${title} - ${pull}, thanks ${user}!`
        : `- ⚠️ _Direct commit_ ${title} - ${commit} by ${user}`;
    });
  const text = [heading, '', ...formattedEntries].join('\n');

  console.log(`✅ Generated Changelog:`);
  console.log(text);

  return text;
};

export const getChanges = async ({
  version,
  from,
  to,
  unpickedPatches,
  verbose,
}: {
  version: string;
  from?: string;
  to?: string;
  unpickedPatches?: boolean;
  verbose?: boolean;
}) => {
  console.log(`💬 Getting changes for ${chalk.blue(version)}`);

  let commits;
  if (unpickedPatches) {
    commits = (await getUnpickedPRs('next-v2', verbose)).map((it) => ({ hash: it.mergeCommit }));
  } else {
    commits = await getAllCommitsBetween({
      from: await getFromCommit(from, verbose),
      to: await getToCommit(to, verbose),
      verbose,
    });
  }

  const repo = await getRepo(verbose);
  const pullRequests = await getPullInfoFromCommits({ repo, commits, verbose }).catch((err) => {
    console.error(
      `🚨 Could not get pull requests from commits, this is usually because you have unpushed commits, or you haven't set the GH_TOKEN environment variable`
    );
    console.error(err);
    throw err;
  });
  const changes = mapToChanges({ commits, pullRequests, unpickedPatches, verbose });
  const changelogText = getChangelogText({
    changes,
    version,
  });

  return { changes, changelogText };
};
