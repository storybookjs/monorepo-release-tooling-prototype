import { SNIPPET_RENDERED } from '@junk-temporary-prototypes/docs-tools';
import { addons, useEffect } from '@junk-temporary-prototypes/preview-api';
import { sourceDecorator } from './sourceDecorator';
import type { StoryContext } from '../types';

jest.mock('@junk-temporary-prototypes/preview-api');
const mockedAddons = addons as jest.Mocked<typeof addons>;
const mockedUseEffect = useEffect as jest.Mocked<typeof useEffect>;

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => typeof val === 'string',
});

const tick = () => new Promise((r) => setTimeout(r, 0));

const makeContext = (name: string, parameters: any, args: any, extra?: object): StoryContext =>
  ({
    id: `html-test--${name}`,
    kind: 'js-text',
    name,
    parameters,
    componentId: '',
    title: '',
    story: '',
    args,
    argTypes: {},
    globals: {},
    initialArgs: {},

    ...extra,
  } as StoryContext);

describe('sourceDecorator', () => {
  let mockChannel: { on: jest.Mock; emit?: jest.Mock };
  beforeEach(() => {
    mockedAddons.getChannel.mockReset();
    // @ts-expect-error (Converted from ts-ignore)
    mockedUseEffect.mockImplementation((cb) => setTimeout(() => cb(), 0));

    mockChannel = { on: jest.fn(), emit: jest.fn() };
    mockedAddons.getChannel.mockReturnValue(mockChannel as any);
  });

  it('should render dynamically for args stories', async () => {
    const storyFn = (args: any) => `<div>args story</div>`;
    const context = makeContext('args', { __isArgsStory: true }, {});
    sourceDecorator(storyFn, context);
    await tick();
    expect(mockChannel.emit).toHaveBeenCalledWith(SNIPPET_RENDERED, {
      id: 'html-test--args',
      args: {},
      source: '<div>args story</div>',
    });
  });

  it('should skip dynamic rendering for no-args stories', async () => {
    const storyFn = () => `<div>classic story</div>`;
    const context = makeContext('classic', {}, {});
    sourceDecorator(storyFn, context);
    await tick();
    expect(mockChannel.emit).not.toHaveBeenCalled();
  });

  it('should use the originalStoryFn if excludeDecorators is set', async () => {
    const storyFn = (args: any) => `<div>args story</div>`;
    const decoratedStoryFn = (args: any) => `
      <div style="padding: 25px; border: 3px solid red;">${storyFn(args)}</div>
    `;
    const context = makeContext(
      'args',
      {
        __isArgsStory: true,
        docs: {
          source: {
            excludeDecorators: true,
          },
        },
      },
      {},
      { originalStoryFn: storyFn }
    );
    sourceDecorator(decoratedStoryFn, context);
    await tick();
    expect(mockChannel.emit).toHaveBeenCalledWith(SNIPPET_RENDERED, {
      id: 'html-test--args',
      args: {},
      source: '<div>args story</div>',
    });
  });
});
