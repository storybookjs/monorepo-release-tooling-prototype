import React from 'react';
import { actions as makeActions } from '@junk-temporary-prototypes/addon-actions';

import type { DecoratorFn } from '@junk-temporary-prototypes/react';
import { ShortcutsScreen } from './shortcuts';

const defaultShortcuts = {
  fullScreen: ['F'],
  togglePanel: ['A'],
  panelPosition: ['D'],
  toggleNav: ['S'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['ctrl', 'shift', ','],
  aboutPage: [','],
  escape: ['escape'], // This one is not customizable
  collapseAll: ['ctrl', 'shift', 'ArrowUp'],
  expandAll: ['ctrl', 'shift', 'ArrowDown'],
  remount: ['alt', 'R'],
};

const actions = makeActions(
  'setShortcut',
  'restoreDefaultShortcut',
  'restoreAllDefaultShortcuts',
  'onClose'
);

export default {
  component: ShortcutsScreen,
  title: 'Settings/ShortcutsScreen',
  decorators: [
    ((StoryFn, c) => (
      <div
        style={{
          position: 'relative',
          height: 'calc(100vh)',
          width: 'calc(100vw)',
        }}
      >
        <StoryFn {...c} />
      </div>
    )) as DecoratorFn,
  ],
};

export const Defaults = () => <ShortcutsScreen shortcutKeys={defaultShortcuts} {...actions} />;
Defaults.storyName = 'default shortcuts';
