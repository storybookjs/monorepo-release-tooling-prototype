import { dedent } from 'ts-dedent';

let hasWarned = false;

/**
 * @deprecated please import this specific function from @junk-temporary-prototypes/addon-links/react
 */
export function LinkTo(): null {
  if (!hasWarned) {
    // eslint-disable-next-line no-console
    console.error(dedent`
      LinkTo has moved to addon-links/react:
      import LinkTo from '@junk-temporary-prototypes/addon-links/react';
    `);
    hasWarned = true;
  }
  return null;
}

export { linkTo, hrefTo, withLinks, navigate } from './utils';
