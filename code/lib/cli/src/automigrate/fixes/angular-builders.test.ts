import type { StorybookConfig } from '@junk-temporary-prototypes/types';
import type { PackageJson } from '../../js-package-manager';
import { makePackageManager, mockStorybookData } from '../helpers/testing-helpers';
import { angularBuilders } from './angular-builders';
import * as helpers from '../../helpers';
import * as angularHelpers from '../../generators/ANGULAR/helpers';

const checkAngularBuilders = async ({
  packageJson,
  main: mainConfig = {},
  storybookVersion = '7.0.0',
}: {
  packageJson: PackageJson;
  main?: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  mockStorybookData({ mainConfig, storybookVersion });

  // mock file system (look at eslint plugin test)

  return angularBuilders.check({
    packageManager: makePackageManager(packageJson),
  });
};

jest.mock('../../helpers', () => ({
  ...jest.requireActual('../../helpers'),
  isNxProject: jest.fn(),
}));

jest.mock('../../generators/ANGULAR/helpers', () => ({
  ...jest.requireActual('../../generators/ANGULAR/helpers'),
  AngularJSON: jest.fn(),
}));

describe('is Nx project', () => {
  beforeEach(() => {
    (helpers.isNxProject as any as jest.SpyInstance).mockReturnValue(true);
  });

  it('should return null', async () => {
    const packageJson = {
      dependencies: { '@junk-temporary-prototypes/angular': '^7.0.0-alpha.0' },
    };

    await expect(checkAngularBuilders({ packageJson })).resolves.toBeNull();
  });
});

describe('is not Nx project', () => {
  beforeEach(() => {
    (helpers.isNxProject as any as jest.SpyInstance).mockReturnValue(false);
  });

  describe('angular builders', () => {
    afterEach(jest.restoreAllMocks);

    describe('Angular not found', () => {
      const packageJson = {
        dependencies: { '@junk-temporary-prototypes/angular': '^7.0.0-alpha.0' },
      };

      it('should return null', async () => {
        await expect(checkAngularBuilders({ packageJson })).resolves.toBeNull();
      });
    });

    describe('Angular < 14.0.0', () => {
      const packageJson = {
        dependencies: { '@junk-temporary-prototypes/angular': '^7.0.0-alpha.0', '@angular/core': '^12.0.0' },
      };

      it('should throw an Error', async () => {
        await expect(checkAngularBuilders({ packageJson })).rejects.toThrowErrorMatchingSnapshot();
      });
    });

    describe('Angular >= 14.0.0', () => {
      const packageJson = {
        dependencies: { '@junk-temporary-prototypes/angular': '^7.0.0-alpha.0', '@angular/core': '^15.0.0' },
      };

      describe('has one Storybook builder defined', () => {
        beforeEach(() => {
          // Mock AngularJSON.constructor
          (angularHelpers.AngularJSON as jest.Mock).mockImplementation(() => ({
            hasStorybookBuilder: true,
          }));
        });

        it('should return null', async () => {
          await expect(checkAngularBuilders({ packageJson })).resolves.toBeNull();
        });
      });

      describe('has multiple projects without root project defined', () => {
        beforeEach(() => {
          // Mock AngularJSON.constructor
          (angularHelpers.AngularJSON as jest.Mock).mockImplementation(() => ({
            hasStorybookBuilder: false,
            projects: {
              project1: { root: 'project1', architect: {} },
              project2: { root: 'project2', architect: {} },
            },
            rootProject: null,
          }));
        });

        it('should return null', async () => {
          await expect(checkAngularBuilders({ packageJson })).resolves.toBeNull();
        });
      });

      describe('has one project', () => {
        beforeEach(() => {
          // Mock AngularJSON.constructor
          (angularHelpers.AngularJSON as jest.Mock).mockImplementation(() => ({
            hasStorybookBuilder: false,
            projects: {
              project1: { root: 'project1', architect: {} },
            },
            rootProject: 'project1',
          }));
        });

        it('should proceed and return data', async () => {
          await expect(checkAngularBuilders({ packageJson })).resolves.toMatchObject({
            mainConfig: {},
            packageManager: {},
          });
        });
      });
    });
  });
});
