import { global } from '@storybook/global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function mockRiotToIncludeCompiler() {
  jest.mock('riot', () => jest.requireActual('riot/riot.js'));
}

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'riot' || (!options.framework && hasDependency('@junk-temporary-prototypes/riot'));
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'riot';
  mockRiotToIncludeCompiler();

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

  jest.mock('@junk-temporary-prototypes/riot', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/riot');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/riot');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'riot' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for riot');
    },
    storybook,
  };
}

const riotLoader: Loader = {
  load,
  test,
};

export default riotLoader;
