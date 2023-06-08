import { run } from './label-patches';
import * as gitClient_ from './utils/git-client';
import { LogResult } from 'simple-git';
import * as githubInfo_ from './utils/get-github-info';
import * as github_ from './utils/github-client';
import ansiRegex from 'ansi-regex';

jest.mock('uuid');
jest.mock('./utils/get-github-info');
jest.mock('./utils/github-client');
jest.mock('./utils/git-client', () => jest.requireActual('jest-mock-extended').mockDeep());

const gitClient = jest.mocked(gitClient_);
const github = jest.mocked(github_);
const githubInfo = jest.mocked(githubInfo_);

const remoteMock = [
  {
    name: 'origin',
    refs: {
      fetch: 'https://github.com/storybookjs/monorepo-release-tooling-prototype.git',
      push: 'https://github.com/storybookjs/monorepo-release-tooling-prototype.git',
    },
  },
];

const gitLogMock: LogResult = {
  all: [
    {
      hash: 'some-hash',
      date: '2023-06-07T09:45:11+02:00',
      message: 'Something else',
      refs: 'HEAD -> main-v2',
      body: '',
      author_name: 'Jeppe Reinhold',
      author_email: 'jeppe@chromatic.com',
    },
    {
      hash: 'b75879c4d3d72f7830e9c5fca9f75a303ddb194d',
      date: '2023-06-07T09:45:11+02:00',
      message: 'Merge pull request #55 from storybookjs/fixes',
      refs: 'HEAD -> main-v2',
      body:
        'Legal: Fix license\n' +
        '(cherry picked from commit 930b47f011f750c44a1782267d698ccdd3c04da3)\n',
      author_name: 'Jeppe Reinhold',
      author_email: 'jeppe@chromatic.com',
    },
  ],
  latest: null!,
  total: 1,
};

const pullInfoMock = {
  user: 'JReinhold',
  id: 'pr_id',
  pull: 55,
  commit: '930b47f011f750c44a1782267d698ccdd3c04da3',
  title: 'Legal: Fix license',
  labels: ['documentation', 'patch', 'picked'],
  links: {
    commit:
      '[`930b47f011f750c44a1782267d698ccdd3c04da3`](https://github.com/storybookjs/monorepo-release-tooling-prototype/commit/930b47f011f750c44a1782267d698ccdd3c04da3)',
    pull: '[#55](https://github.com/storybookjs/monorepo-release-tooling-prototype/pull/55)',
    user: '[@JReinhold](https://github.com/JReinhold)',
  },
};

beforeAll(() => {
  // mock IO
  gitClient.getLatestTag.mockResolvedValueOnce('v7.2.1');
  gitClient.git.log.mockResolvedValueOnce(gitLogMock);
  gitClient.git.getRemotes.mockResolvedValue(remoteMock);
  githubInfo.getPullInfoFromCommit.mockResolvedValueOnce(pullInfoMock);
  github.getLabelIds.mockResolvedValueOnce({ picked: 'pick-id' });
});

test('it should fail early when no GH_TOKEN is set', async () => {
  await expect(run({})).rejects.toThrowErrorMatchingInlineSnapshot(
    `"GH_TOKEN environment variable must be set, exiting."`
  );
});

test('it should label the PR associated with cheery picks in the current branch', async () => {
  process.env.GH_TOKEN = 'MY_SECRET';

  const writeStderr = jest.spyOn(process.stderr, 'write').mockImplementation();

  await run({});
  expect(github.githubGraphQlClient.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "
          mutation ($input: AddLabelsToLabelableInput!) {
            addLabelsToLabelable(input: $input) {
              clientMutationId
            }
          }
        ",
        {
          "input": {
            "clientMutationId": "111db3d5-7ad7-5d3b-a8a9-efa7e7e9de57",
            "labelIds": [
              "pick-id",
            ],
            "labelableId": "pr_id",
          },
        },
      ],
    ]
  `);

  expect.addSnapshotSerializer({
    serialize: (value) => {
      const stripAnsi = value.map((it: string) => it.replace(ansiRegex(), ''));
      return JSON.stringify(stripAnsi, null, 2);
    },
    test: () => true,
  });

  expect(writeStderr.mock.calls.map(([text]) => text)).toMatchInlineSnapshot(`
    [
      "- Looking for latest tag\\n",
      "✔ Found latest tag: v7.2.1\\n",
      "- Looking at cherry pick commits since v7.2.1\\n",
      "✔ Found the following picks 🍒:\\n Commit: 930b47f011f750c44a1782267d698ccdd3c04da3\\n PR: [#55](https://github.com/storybookjs/monorepo-release-tooling-prototype/pull/55)\\n",
      "- Labeling the PRs with the picked label...\\n",
      "✔ Successfully labeled all PRs with the picked label.\\n"
    ]
  `);
});
