import { replaceUrlParams, getRegexMatches } from '../src/utils';

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
        '/:test/:one/:two*/:three+',
        {
          test: 'a',
          one: ['b', 'c'],
          two: ['d'],
          three: 'e',
        },
        {},
        ''
      )
    ).toEqual('/a/b/c/d/e');
  });
});
