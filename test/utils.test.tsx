import {
  replaceUrlParams,
  getRegexMatches,
  createMatcher,
  createRouter,
} from '../src/utils';

describe('createMatcher', () => {
  it('should match empty string', () => {
    let matcher = createMatcher('/:a/:b');
    let result = matcher('/a/b');
    expect(result).toEqual({ a: 'a', b: 'b' });

    matcher = createMatcher('/:a/:b@');
    result = matcher('/a/');
    expect(result).toEqual({ a: 'a' });
  });
});

describe('getRegexMatches', () => {
  it('can find matches', () => {
    expect(getRegexMatches('/:test/:one?/:two*/:three+')).toEqual([
      ['/:test', ':test', 'test'],
      ['/:one?', ':one?', 'one'],
      ['/:two*', ':two*', 'two'],
      ['/:three+', ':three+', 'three'],
    ]);
  });
});

describe('replaceUrlParams', () => {
  it('should render a Router on the home page', () => {
    expect(
      replaceUrlParams(
        '/:test/:one/:two*/:three+/:four@',
        {
          test: 'a',
          one: 'b/c',
          two: 'd',
          three: 'e',
          four: 'f',
        },
        {},
        ''
      )
    ).toEqual('/a/b/c/d/e/f');
  });

  it('should render with empty string', () => {
    expect(
      replaceUrlParams(
        '/test/:a@/:b@',
        {
          a: '',
          b: '',
        },
        {},
        ''
      )
    ).toEqual('/test//');
  });
});

describe('createRouter', () => {
  it('should match a single empty param', () => {
    let called = false;
    const router = createRouter({
      '/test/:a@': () => (called = true),
    });

    expect(router('/test', '')).toBeFalsy();
    expect(called).toBe(false);

    expect(router('/test/', '')).toBeTruthy();
    expect(called).toBe(true);
  });

  it('should match two empty params', () => {
    let called = false;
    const router = createRouter({
      '/test/:a@/:b@': () => (called = true),
    });

    expect(router('/test//', '')).toBeTruthy();
    expect(called).toBe(true);
  });
});
