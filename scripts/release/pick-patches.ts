/* eslint-disable no-await-in-loop */
import program from 'commander';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import type { GraphQlQueryResponseData } from '@octokit/graphql';
import { graphql } from '@octokit/graphql';
import ora from 'ora';
import { simpleGit } from 'simple-git';

program.name('pick-patches').description('Cherry pick patch PRs back to main');

const logger = console;

const OWNER = 'storybookjs';
const REPO = 'monorepo-release-tooling-prototype';
const SOURCE_BRANCH = 'next-v2';

const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${process.env.GH_TOKEN}` },
});

const git = simpleGit();

interface PR {
  number: number;
  id: string;
  branch: string;
  title: string;
  mergeCommit: string;
}

const LABEL = {
  PATCH: 'patch',
  PICKED: 'picked',
  DOCUMENTATION: 'documentation',
} as const;

async function getUnpickedPRs(sourceBranch: string): Promise<Array<PR>> {
  const result = await graphqlWithAuth<GraphQlQueryResponseData>(
    `
      query ($owner: String!, $repo: String!, $state: PullRequestState!, $order: IssueOrder!) {
        repository(owner: $owner, name: $repo) {
          pullRequests(states: [$state], labels: ["patch"], orderBy: $order, first: 50) {
            nodes {
              id
              number
              title
              baseRefName
              mergeCommit { 
                abbreviatedOid
              }
              labels(first: 20) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    `,
    {
      owner: OWNER,
      repo: REPO,
      order: {
        field: 'UPDATED_AT',
        direction: 'ASC',
      },
      state: 'MERGED',
    }
  );

  const {
    pullRequests: { nodes },
  } = result.repository;

  const prs = nodes.map((node: any) => ({
    number: node.number,
    id: node.id,
    branch: node.baseRefName,
    title: node.title,
    mergeCommit: node.mergeCommit.abbreviatedOid,
    labels: node.labels.nodes.map((l: any) => l.name),
  }));

  const unpickedPRs = prs.filter((pr: any) => !pr.labels.includes(LABEL.PICKED));
  return unpickedPRs.filter((pr: any) => pr.branch === sourceBranch);
}

function formatPR(pr: PR): string {
  return `https://github.com/${OWNER}/${REPO}/pull/${pr.number} "${pr.title}" ${chalk.yellow(
    pr.mergeCommit
  )}`;
}

// @ts-expect-error not used atm
async function getLabelIds(labelNames: string[]) {
  const query = labelNames.join('+');
  const result = await graphqlWithAuth<GraphQlQueryResponseData>(
    `
      query ($owner: String!, $repo: String!, $q: String!) {
        repository(owner: $owner, name: $repo) {
          labels(query: $q, first: 10) {
            nodes {
              id
              name
              description
            }
          }
        }
      }
    `,
    {
      owner: OWNER,
      repo: REPO,
      q: query,
    }
  );

  const { labels } = result.repository;
  const labelToId = {} as Record<string, string>;
  labels.nodes.forEach((label: { name: string; id: string }) => {
    labelToId[label.name] = label.id;
  });
  return labelToId;
}

// @ts-expect-error not used atm
async function labelPR(id: string, labelToId: Record<string, string>) {
  await graphqlWithAuth(
    `
      mutation ($input: AddLabelsToLabelableInput!) {
        addLabelsToLabelable(input: $input) {
          clientMutationId
        }
      }
    `,
    {
      input: {
        labelIds: [labelToId[LABEL.PICKED]],
        labelableId: id,
        clientMutationId: uuidv4(),
      },
    }
  );
}

export const run = async (_: unknown) => {
  if (!process.env.GH_TOKEN) {
    logger.error('GH_TOKEN environment variable must be set, exiting.');
    process.exit(1);
  }

  const sourceBranch = SOURCE_BRANCH;

  const spinner = ora('Searching for patch PRs to cherry-pick').start();

  // const labelToId = await getLabelIds(Object.values(LABEL));
  const patchPRs = await getUnpickedPRs(sourceBranch);

  if (patchPRs.length > 0) {
    spinner.succeed(`Found ${patchPRs.length} PRs to cherry-pick to main.`);
  } else {
    spinner.warn('No PRs found.');
  }

  for (const pr of patchPRs) {
    const spinner = ora(`Cherry picking #${pr.id}`).start();

    try {
      await git.raw(['cherry-pick', '-m', '1', pr.mergeCommit]);
      // We want to label only when merging the PR
      // await labelPR(pr.id, labelToId);
      spinner.succeed(`Picked: ${formatPR(pr)}`);
      // results.push({ ok: true, pr, error: null });
    } catch (err) {
      spinner.fail(`Failed to automatically pick: ${formatPR(pr)}`);
      const abort = ora(`Aborting cherry pick for merge commit: ${pr.mergeCommit}`).start();
      try {
        await git.raw(['cherry-pick', '--abort']);
        abort.stop();
      } catch (error) {
        abort.warn(`Failed to abort cherry pick (${pr.mergeCommit})`);
      }

      spinner.info(
        `This PR can be picked manually with: ${chalk.grey(
          `git cherry-pick -m1 ${pr.mergeCommit}`
        )}`
      );
    }
  }
};

if (require.main === module) {
  const options = program.parse(process.argv);
  run(options).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
