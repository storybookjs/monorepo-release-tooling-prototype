import { global as globalThis } from '@storybook/global';
import type { PartialStoryFn, PlayFunctionContext } from '@junk-temporary-prototypes/types';
import { useEffect, useState } from '@junk-temporary-prototypes/preview-api';
import { within, userEvent } from '@storybook/testing-library';

export default {
  component: globalThis.Components.Button,
};

export const UseState = {
  decorators: [
    (story: PartialStoryFn) => {
      const [count, setCount] = useState(0);

      return story({
        args: {
          label: `Clicked ${count} times`,
          onClick: () => {
            setCount(count + 1);
          },
        },
      });
    },
  ],
  play: async ({ canvasElement }: PlayFunctionContext<any>) => {
    const button = await within(canvasElement).findByText('Clicked 0 times');

    await userEvent.click(button);
    await within(canvasElement).findByText('Clicked 1 times');
  },
};

// NOTE: it isn't possible to write a play function for this story, as the
// useEffect hooked doesn't fire until *after* the story has rendered, which includes
// the play function running.
export const UseEffect = {
  decorators: [
    (story: PartialStoryFn) => {
      const [count, setCount] = useState(0);

      useEffect(() => {
        setCount(1);
      }, []);

      return story({
        args: {
          label: count > 0 ? `useEffect worked!` : `useEffect hasn't worked yet!`,
          onClick: () => {},
        },
      });
    },
  ],
};
