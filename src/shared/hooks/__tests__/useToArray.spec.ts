import { renderHook } from '@testing-library/react-hooks';
import { useToArray } from '../useToArray';

describe('useToArray', () => {
  test.each([
    [null, []],
    [undefined, []],
    [1, []],
    ['str', []],
    [{}, []],
    [[1], [1]],
  ])('%o => %o', (input, out) => {
    const { result } = renderHook(() => useToArray(input));

    expect(result.current).toMatchObject(out);
  });
});
