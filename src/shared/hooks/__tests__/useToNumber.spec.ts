import { renderHook } from '@testing-library/react-hooks';
import { useToNumber } from '../useToNumber';

describe('useToNumber', () => {
  test.each([
    [1, 1],
    [undefined, undefined],
    [null, null],
    [NaN, 0],
    ['1', 1],
    ['any', 0],
  ])('%o => %o', (input, out) => {
    const { result } = renderHook(() => useToNumber(input));

    expect(result.current).toBe(out);
  });
});
