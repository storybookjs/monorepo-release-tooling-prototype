import { Channel } from '@junk-temporary-prototypes/channels';
import type { Renderer, StoryIndexEntry } from '@junk-temporary-prototypes/types';
import type { StoryStore } from '../../store';
import { PREPARE_ABORTED } from './Render';

import { StoryRender } from './StoryRender';

const entry = {
  type: 'story',
  id: 'component--a',
  name: 'A',
  title: 'component',
  importPath: './component.stories.ts',
} as StoryIndexEntry;

const createGate = (): [Promise<any | undefined>, (_?: any) => void] => {
  let openGate = (_?: any) => {};
  const gate = new Promise<any | undefined>((resolve) => {
    openGate = resolve;
  });
  return [gate, openGate];
};

describe('StoryRender', () => {
  it('throws PREPARE_ABORTED if torndown during prepare', async () => {
    const [importGate, openImportGate] = createGate();
    const mockStore = {
      loadStory: jest.fn(async () => {
        await importGate;
        return {};
      }),
      cleanupStory: jest.fn(),
    };

    const render = new StoryRender(
      new Channel(),
      mockStore as unknown as StoryStore<Renderer>,
      jest.fn(),
      {} as any,
      entry.id,
      'story'
    );

    const preparePromise = render.prepare();

    render.teardown();

    openImportGate();

    await expect(preparePromise).rejects.toThrowError(PREPARE_ABORTED);
  });

  it('does run play function if passed autoplay=true', async () => {
    const story = {
      id: 'id',
      title: 'title',
      name: 'name',
      tags: [],
      applyLoaders: jest.fn(),
      unboundStoryFn: jest.fn(),
      playFunction: jest.fn(),
      prepareContext: jest.fn(),
    };

    const render = new StoryRender(
      new Channel(),
      { getStoryContext: () => ({}) } as any,
      jest.fn() as any,
      {} as any,
      entry.id,
      'story',
      { autoplay: true },
      story as any
    );

    await render.renderToElement({} as any);
    expect(story.playFunction).toHaveBeenCalled();
  });

  it('does not run play function if passed autoplay=false', async () => {
    const story = {
      id: 'id',
      title: 'title',
      name: 'name',
      tags: [],
      applyLoaders: jest.fn(),
      unboundStoryFn: jest.fn(),
      playFunction: jest.fn(),
      prepareContext: jest.fn(),
    };

    const render = new StoryRender(
      new Channel(),
      { getStoryContext: () => ({}) } as any,
      jest.fn() as any,
      {} as any,
      entry.id,
      'story',
      { autoplay: false },
      story as any
    );

    await render.renderToElement({} as any);
    expect(story.playFunction).not.toHaveBeenCalled();
  });

  it('passes the initialArgs to loaders and render function if forceInitialArgs is true', async () => {
    const story = {
      id: 'id',
      title: 'title',
      name: 'name',
      tags: [],
      initialArgs: { a: 'b' },
      applyLoaders: jest.fn(),
      unboundStoryFn: jest.fn(),
      playFunction: jest.fn(),
      prepareContext: jest.fn((ctx) => ctx),
    };

    const renderToScreen = jest.fn();

    const render = new StoryRender(
      new Channel(),
      { getStoryContext: () => ({ args: { a: 'c ' } }) } as any,
      renderToScreen as any,
      {} as any,
      entry.id,
      'story',
      { forceInitialArgs: true },
      story as any
    );

    await render.renderToElement({} as any);

    expect(story.applyLoaders).toHaveBeenCalledWith(
      expect.objectContaining({
        args: { a: 'b' },
      })
    );

    expect(renderToScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        storyContext: expect.objectContaining({
          args: { a: 'b' },
        }),
      }),
      expect.any(Object)
    );
  });
});
