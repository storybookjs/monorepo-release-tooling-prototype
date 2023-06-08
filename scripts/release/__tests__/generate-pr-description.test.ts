import {
  generateReleaseDescription,
  generateNonReleaseDescription,
  mapToChangelist,
  mapCherryPicksToTodo,
} from '../generate-pr-description';
import type { Change } from '../utils/get-changes';

describe('Generate PR Description', () => {
  const changes: Change[] = [
    {
      user: 'JReinhold',
      title: 'Some PR title for a bug',
      labels: ['bug', 'build', 'other label', 'patch'],
      commit: 'abc123',
      pull: '42',
      links: {
        commit: '[abc123](https://github.com/storybookjs/storybook/commit/abc123)',
        pull: '[#42](https://github.com/storybookjs/storybook/pull/42)',
        user: '[@JReinhold](https://github.com/JReinhold)',
      },
    },
    {
      // this Bump version commit should be ignored
      user: 'github-actions[bot]',
      pull: null,
      commit: '012b58140c3606efeacbe99c0c410624b0a1ed1f',
      title: 'Bump version on `next`: preminor (alpha) from 7.2.0 to 7.3.0-alpha.0',
      labels: null,
      links: {
        commit:
          '[`012b58140c3606efeacbe99c0c410624b0a1ed1f`](https://github.com/storybookjs/monorepo-release-tooling-prototype/commit/012b58140c3606efeacbe99c0c410624b0a1ed1f)',
        pull: null,
        user: '[@github-actions[bot]](https://github.com/github-actions%5Bbot%5D)',
      },
    },
    {
      user: 'shilman',
      title: 'Some title for a "direct commit"',
      labels: null,
      commit: '22bb11',
      pull: null,
      links: {
        commit: '[22bb11](https://github.com/storybookjs/storybook/commit/22bb11)',
        pull: null,
        user: '[@shilman](https://github.com/shilman)',
      },
    },
    {
      user: 'shilman',
      title: 'Another PR `title` for docs',
      labels: ['another label', 'documentation', 'patch'],
      commit: 'ddd222',
      pull: '11',
      links: {
        commit: '[ddd222](https://github.com/storybookjs/storybook/commit/ddd222)',
        pull: '[#11](https://github.com/storybookjs/storybook/pull/11)',
        user: '[@shilman](https://github.com/shilman)',
      },
    },
    {
      user: 'JReinhold',
      title: "Some PR title for a 'new' feature",
      labels: ['feature request', 'other label'],
      commit: 'wow1337',
      pull: '48',
      links: {
        commit: '[wow1337](https://github.com/storybookjs/storybook/commit/wow1337)',
        pull: '[#48](https://github.com/storybookjs/storybook/pull/48)',
        user: '[@JReinhold](https://github.com/JReinhold)',
      },
    },
    {
      user: 'JReinhold',
      title: 'Some PR title with a missing label',
      labels: ['incorrect label', 'other label'],
      commit: 'bad999',
      pull: '77',
      links: {
        commit: '[bad999](https://github.com/storybookjs/storybook/commit/bad999)',
        pull: '[#77](https://github.com/storybookjs/storybook/pull/77)',
        user: '[@JReinhold](https://github.com/JReinhold)',
      },
    },
  ];
  describe('mapToChangelist', () => {
    it('should return a correct string for releases', () => {
      expect(mapToChangelist({ changes, isRelease: true })).toMatchInlineSnapshot(`
        "- **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a "direct commit" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR \`title\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a 'new' feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **❔ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct"
      `);
    });
    it('should return a correct string for non-releases', () => {
      expect(mapToChangelist({ changes, isRelease: false })).toMatchInlineSnapshot(`
        "- **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        - **⚠️ Direct commit**: Some title for a "direct commit" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        - **📝 Documentation**: Another PR \`title\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        - **✨ Feature Request**: Some PR title for a 'new' feature [#48](https://github.com/storybookjs/storybook/pull/48)
        - **❔ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)"
      `);
    });
  });

  describe('mapCherryPicksToTodo', () => {
    it('should return a correct string for releases', () => {
      expect(mapCherryPicksToTodo({ changes, commits: ['abc123'] })).toMatchInlineSnapshot(`
        "## 🍒 Manual cherry picking needed!

        The following pull requests could not be cherry-picked automatically because it resulted in merge conflicts.
        For each pull request below, you need to either manually cherry pick it, or discard it by removing the "patch" label from the PR and re-generate this PR.

        - [ ] [#42](https://github.com/storybookjs/storybook/pull/42): \`git cherry-pick -m1 -x abc123\`"
      `);
    });
  });

  describe('description generator', () => {
    const changeList = `- **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct
- **⚠️ Direct commit**: Some title for a \\"direct commit\\" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
\t- [ ] The change is appropriate for the version bump
- **📝 Documentation**: Another PR \\\`title\\\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct
- **✨ Feature Request**: Some PR title for a \\'new\\' feature [#48](https://github.com/storybookjs/storybook/pull/48)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct
- **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct`;

    const manualCherryPicks = `## 🍒 Manual cherry picking needed!

The following pull requests could not be cherry-picked automatically because it resulted in merge conflicts.
For each pull request below, you need to either manually cherry pick it, or discard it by removing the "patch" label from the PR and re-generate this PR.

- [ ] [#42](https://github.com/storybookjs/storybook/pull/42): \`git cherry-pick -m1 -x abc123\``;

    it('should return a correct string with cherry picks for releases', () => {
      const changelogText = `## 7.1.0-alpha.11

- Some PR \`title\` for a bug [#42](https://github.com/storybookjs/storybook/pull/42), thanks [@JReinhold](https://github.com/JReinhold)
- Some PR 'title' for a feature request [#48](https://github.com/storybookjs/storybook/pull/48), thanks [@JReinhold](https://github.com/JReinhold)
- Antoher PR "title" for maintainance [#49](https://github.com/storybookjs/storybook/pull/49), thanks [@JReinhold](https://github.com/JReinhold)`;
      expect(
        generateReleaseDescription({
          currentVersion: '7.1.0-alpha.10',
          nextVersion: '7.1.0-alpha.11',
          changeList,
          changelogText,
          manualCherryPicks,
        })
      ).toMatchInlineSnapshot(`
        "This is an automated pull request that bumps the version from \\\`7.1.0-alpha.10\\\` to \\\`7.1.0-alpha.11\\\`.
        Once this pull request is merged, it will trigger a new release of version \\\`7.1.0-alpha.11\\\`.
        If you\\'re not a core maintainer with permissions to release you can ignore this pull request.

        ## To do

        Before merging the PR, there are a few QA steps to go through:

        - [ ] Add the \\"freeze\\" label to this PR, to ensure it doesn\\'t get automatically forced pushed by new changes.

        And for each change below:

        1. Ensure the change is appropriate for the version bump. E.g. patch release should only contain patches, not new or de-stabilizing features. If a change is not appropriate, revert the PR.
        2. Ensure the PR is labeled correctly with \\"BREAKING CHANGE\\", \\"feature request\\", \\"maintainance\\", \\"bug\\", \\"build\\" or \\"documentation\\".
        3. Ensure the PR title is correct, and follows the format \\"[Area]: [Summary]\\", e.g. *\\"React: Fix hooks in CSF3 render functions\\"*. If it is not correct, change the title in the PR.
            - Areas include: React, Vue, Core, Docs, Controls, etc.
            - First word of summary indicates the type: “Add”, “Fix”, “Upgrade”, etc.
            - The entire title should fit on a line

        This is a list of all the PRs merged and commits pushed directly to \\\`next\\\`, that will be part of this release:

        - **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a \\\\"direct commit\\\\" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR \\\\\`title\\\\\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a \\\\'new\\\\' feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct

        ## 🍒 Manual cherry picking needed!

        The following pull requests could not be cherry-picked automatically because it resulted in merge conflicts.
        For each pull request below, you need to either manually cherry pick it, or discard it by removing the \\"patch\\" label from the PR and re-generate this PR.

        - [ ] [#42](https://github.com/storybookjs/storybook/pull/42): \\\`git cherry-pick -m1 -x abc123\\\`

        If you\\'ve made any changes doing the above QA (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish. It will wipe your progress in this to do, which is expected.

        When everything above is done:
        - [ ] Merge this PR
        - [ ] [Follow the publish workflow run and see it finishes succesfully](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)

        ---

        # Generated changelog

        ## 7.1.0-alpha.11

        - Some PR \\\`title\\\` for a bug [#42](https://github.com/storybookjs/storybook/pull/42), thanks [@ JReinhold](https://github.com/JReinhold)
        - Some PR \\'title\\' for a feature request [#48](https://github.com/storybookjs/storybook/pull/48), thanks [@ JReinhold](https://github.com/JReinhold)
        - Antoher PR \\"title\\" for maintainance [#49](https://github.com/storybookjs/storybook/pull/49), thanks [@ JReinhold](https://github.com/JReinhold)"
      `);
    });

    it('should return a correct string for non-releases with cherry picks', () => {
      expect(generateNonReleaseDescription(changeList, manualCherryPicks)).toMatchInlineSnapshot(`
        "This is an automated pull request. None of the changes requires a version bump, they are only internal or documentation related. Merging this PR will not trigger a new release, but documentation will be updated.
        If you\\'re not a core maintainer with permissions to release you can ignore this pull request.

        This is a list of all the PRs merged and commits pushed directly to \\\`next\\\` since the last release:

        - **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a \\\\"direct commit\\\\" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR \\\\\`title\\\\\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a \\\\'new\\\\' feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct

        ## 🍒 Manual cherry picking needed!

        The following pull requests could not be cherry-picked automatically because it resulted in merge conflicts.
        For each pull request below, you need to either manually cherry pick it, or discard it by removing the \\"patch\\" label from the PR and re-generate this PR.

        - [ ] [#42](https://github.com/storybookjs/storybook/pull/42): \\\`git cherry-pick -m1 -x abc123\\\`

        If you\\'ve made any changes (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish.

        When everything above is done:
        - [ ] Merge this PR
        - [ ] [Approve the publish workflow run](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)"
      `);
    });

    it('should return a correct string without cherry picks for releases', () => {
      const changelogText = `## 7.1.0-alpha.11

- Some PR \`title\` for a bug [#42](https://github.com/storybookjs/storybook/pull/42), thanks [@JReinhold](https://github.com/JReinhold)
- Some PR 'title' for a feature request [#48](https://github.com/storybookjs/storybook/pull/48), thanks [@JReinhold](https://github.com/JReinhold)
- Antoher PR "title" for maintainance [#49](https://github.com/storybookjs/storybook/pull/49), thanks [@JReinhold](https://github.com/JReinhold)`;
      expect(
        generateReleaseDescription({
          currentVersion: '7.1.0-alpha.10',
          nextVersion: '7.1.0-alpha.11',
          changeList,
          changelogText,
        })
      ).toMatchInlineSnapshot(`
        "This is an automated pull request that bumps the version from \\\`7.1.0-alpha.10\\\` to \\\`7.1.0-alpha.11\\\`.
        Once this pull request is merged, it will trigger a new release of version \\\`7.1.0-alpha.11\\\`.
        If you\\'re not a core maintainer with permissions to release you can ignore this pull request.

        ## To do

        Before merging the PR, there are a few QA steps to go through:

        - [ ] Add the \\"freeze\\" label to this PR, to ensure it doesn\\'t get automatically forced pushed by new changes.

        And for each change below:

        1. Ensure the change is appropriate for the version bump. E.g. patch release should only contain patches, not new or de-stabilizing features. If a change is not appropriate, revert the PR.
        2. Ensure the PR is labeled correctly with \\"BREAKING CHANGE\\", \\"feature request\\", \\"maintainance\\", \\"bug\\", \\"build\\" or \\"documentation\\".
        3. Ensure the PR title is correct, and follows the format \\"[Area]: [Summary]\\", e.g. *\\"React: Fix hooks in CSF3 render functions\\"*. If it is not correct, change the title in the PR.
            - Areas include: React, Vue, Core, Docs, Controls, etc.
            - First word of summary indicates the type: “Add”, “Fix”, “Upgrade”, etc.
            - The entire title should fit on a line

        This is a list of all the PRs merged and commits pushed directly to \\\`next\\\`, that will be part of this release:

        - **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a \\\\"direct commit\\\\" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR \\\\\`title\\\\\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a \\\\'new\\\\' feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct



        If you\\'ve made any changes doing the above QA (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish. It will wipe your progress in this to do, which is expected.

        When everything above is done:
        - [ ] Merge this PR
        - [ ] [Follow the publish workflow run and see it finishes succesfully](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)

        ---

        # Generated changelog

        ## 7.1.0-alpha.11

        - Some PR \\\`title\\\` for a bug [#42](https://github.com/storybookjs/storybook/pull/42), thanks [@ JReinhold](https://github.com/JReinhold)
        - Some PR \\'title\\' for a feature request [#48](https://github.com/storybookjs/storybook/pull/48), thanks [@ JReinhold](https://github.com/JReinhold)
        - Antoher PR \\"title\\" for maintainance [#49](https://github.com/storybookjs/storybook/pull/49), thanks [@ JReinhold](https://github.com/JReinhold)"
      `);
    });

    it('should return a correct string for non-releases without cherry picks', () => {
      expect(generateNonReleaseDescription(changeList)).toMatchInlineSnapshot(`
        "This is an automated pull request. None of the changes requires a version bump, they are only internal or documentation related. Merging this PR will not trigger a new release, but documentation will be updated.
        If you\\'re not a core maintainer with permissions to release you can ignore this pull request.

        This is a list of all the PRs merged and commits pushed directly to \\\`next\\\` since the last release:

        - **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a \\\\"direct commit\\\\" [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR \\\\\`title\\\\\` for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a \\\\'new\\\\' feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct



        If you\\'ve made any changes (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish.

        When everything above is done:
        - [ ] Merge this PR
        - [ ] [Approve the publish workflow run](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)"
      `);
    });
  });
});
