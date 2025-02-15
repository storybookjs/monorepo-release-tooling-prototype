import { global } from '@storybook/global';

const { document } = global;

const riotForStorybook = jest.requireActual('@junk-temporary-prototypes/riot');

function bootstrapADocumentAndReturnANode() {
  const rootElement = document.createElement('div');
  rootElement.id = 'storybook-root';
  document.body = document.createElement('body');
  document.body.appendChild(rootElement);
  return rootElement;
}

function makeSureThatResultIsRenderedSomehow({ context, result, rootElement }: any) {
  if (!rootElement.firstChild) {
    const { kind, name } = context;
    riotForStorybook.render({
      storyFn: () => result,
      kind,
      name,
    });
  }
}

function getRenderedTree(story: any, context: any) {
  const rootElement = bootstrapADocumentAndReturnANode();

  const result = story.render();

  makeSureThatResultIsRenderedSomehow({ context, result, rootElement });

  return rootElement;
}

export default getRenderedTree;
