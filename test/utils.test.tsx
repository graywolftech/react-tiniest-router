import { replaceUrlParams, getRegexMatches, createMatcher } from '../src/utils';

describe('createMatcher', () => {
  it('should match empty string', () => {
    let matcher = createMatcher('/:a/:b');
    let result = matcher('/a/b');
    expect(result).toEqual({ a: 'a', b: 'b' });

    matcher = createMatcher('/:a@/:b');
    result = matcher('//b');
    expect(result).toEqual({ b: 'b' });
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
});
