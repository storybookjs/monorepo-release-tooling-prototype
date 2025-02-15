import { validateFrameworkName } from './validate-config';

describe('validateFrameworkName', () => {
  afterEach(jest.resetAllMocks);
  it('should throw if name is undefined', () => {
    expect(() => validateFrameworkName(undefined)).toThrow();
  });

  it('should throw if name is a renderer', () => {
    expect(() => validateFrameworkName('react')).toThrow();
    expect(() => validateFrameworkName('@junk-temporary-prototypes/react')).toThrow();
  });

  it('should not throw if framework is a known framework', () => {
    expect(() => validateFrameworkName('@junk-temporary-prototypes/react-vite')).not.toThrow();
  });

  it('should not throw if framework is unknown (community) but can be resolved', () => {
    // mock require.resolve to return a value
    jest.spyOn(require, 'resolve').mockReturnValue('some-community-framework');
    expect(() => validateFrameworkName('some-community-framework')).toThrow();
  });

  it('should throw if framework is unknown and cannot be resolved', () => {
    // mock require.resolve to fail
    jest.spyOn(require, 'resolve').mockImplementation(() => {
      throw new Error('Cannot resolve');
    });

    expect(() => validateFrameworkName('foo')).toThrow();
  });
});
