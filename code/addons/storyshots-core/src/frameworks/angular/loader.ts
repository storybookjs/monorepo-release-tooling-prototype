import hasDependency from '../hasDependency';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function setupAngularJestPreset() {
  // Angular + Jest + Storyshots = Crazy Shit:
  // We need to require 'jest-preset-angular/build/setupJest' before any storybook code
  // is running inside jest -  one of the things that `jest-preset-angular/build/setupJest` does is
  // extending the `window.Reflect` with all the needed metadata functions, that are required
  // for emission of the TS decorations like 'design:paramtypes'
  jest.requireActual('jest-preset-angular/setup-jest');
}

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'angular' || (!options.framework && hasDependency('@junk-temporary-prototypes/angular'))
  );
}

function load(options: StoryshotsOptions) {
  setupAngularJestPreset();

  let mockStartedAPI: any;

  jest.mock('@junk-temporary-prototypes/preview-api', () => {
    const previewAPI = jest.requireActual('@junk-temporary-prototypes/preview-api');

    return {
      ...previewAPI,
      start: (...args: any[]) => {
        mockStartedAPI = previewAPI.start(...args);
        return mockStartedAPI;
      },
    };
  });

  jest.mock('@junk-temporary-prototypes/angular', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/angular');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/angular');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'angular' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for angular');
    },
    storybook,
  };
}

const angularLoader: Loader = {
  load,
  test,
};

export default angularLoader;
