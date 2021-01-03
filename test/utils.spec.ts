import { createMatcher } from '../src/utils';

describe('createMatcher', () => {
  it('should match empty string', () => {
    let matcher = createMatcher('/:a/:b');
    let result = matcher('/a/b');
    expect(result).toEqual({ a: 'a', b: 'b' });

    matcher = createMatcher('/:a*/:b');
    result = matcher('//b');
    expect(result).toEqual({ b: 'b' });
  });
});
