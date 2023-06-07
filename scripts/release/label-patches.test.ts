import { run } from './label-patches';
import * as gitClient_ from './utils/git-client';
import { LogResult } from 'simple-git';
import * as githubInfo_ from './utils/get-github-info';
import * as github_ from './utils/github-client';

jest.mock('uuid');
jest.mock('./utils/get-github-info');
jest.mock('./utils/github-client');
jest.mock('./utils/git-client', () => ({
  getLatestTag: jest.fn(),
  git: {
    log: jest.fn(),
    getRemotes: jest.fn(),
  },
}));

const gitClient = gitClient_ as jest.MockedObjectDeep<typeof import('./utils/git-client')>;
const github = github_ as jest.MockedObjectDeep<typeof import('./utils/github-client')>;
const githubInfo = githubInfo_ as jest.MockedObjectDeep<typeof import('./utils/get-github-info')>;

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
  id: 'PR_kwDOJcZEJ85SWPp7',
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

test('It should fail early when no GH_TOKEN is set', async () => {
  await expect(run({})).rejects.toThrowErrorMatchingInlineSnapshot(
    `"GH_TOKEN environment variable must be set, exiting."`
  );
});

test('it labels the PR', async () => {
  process.env.GH_TOKEN = 'MY_SECRET';
  let stderr = '';
  jest.spyOn(process.stderr, 'write').mockImplementation((message) => {
    stderr += `${message}`;
    return true;
  });
  gitClient.getLatestTag.mockResolvedValueOnce('v7.2.1');
  gitClient.git.log.mockResolvedValueOnce(gitLogMock);
  gitClient.git.getRemotes.mockResolvedValue(remoteMock);
  githubInfo.getPullInfoFromCommit.mockResolvedValueOnce(pullInfoMock);
  github.getLabelIds.mockResolvedValueOnce({ picked: 'pick-id' });
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
            "labelableId": "PR_kwDOJcZEJ85SWPp7",
          },
        },
      ],
    ]
  `);
  expect(stderr).toMatchInlineSnapshot(`
    "- Looking for latest tag
    [32m✔[39m Found latest tag: v7.2.1
    - Looking at cherry pick commits since v7.2.1
    [32m✔[39m Found the following picks 🍒:
     Commit: 930b47f011f750c44a1782267d698ccdd3c04da3
     PR: [#55](https://github.com/storybookjs/monorepo-release-tooling-prototype/pull/55)
    - Labeling the PRs with the picked label...
    [32m✔[39m Successfully labeled all PRs with the picked label.
    "
  `);
});
