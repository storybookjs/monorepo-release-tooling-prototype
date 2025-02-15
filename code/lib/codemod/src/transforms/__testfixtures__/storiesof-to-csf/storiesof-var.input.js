/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@junk-temporary-prototypes/react';
import Hero from './Hero';

const chapter = storiesOf('Webapp screens/Marketing/LandingScreen/Hero', module).add(
  'default',
  () => <Hero />
);

chapter.add('loading', () => <Hero loading />);
