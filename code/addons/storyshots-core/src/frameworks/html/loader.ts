import { global } from '@storybook/global';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'html';
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'html';

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

  jest.mock('@junk-temporary-prototypes/html', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/html');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/html');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'html' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for HTML');
    },
    storybook,
  };
}

const htmLoader: Loader = {
  load,
  test,
};

export default htmLoader;
