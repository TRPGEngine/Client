import { renderHook } from '@testing-library/react-hooks';
import { useToBoolean } from '../useToBoolean';

describe('useToBoolean', () => {
  test.each([
    [true, true],
    [false, false],
    ['true', true],
    ['false', false],
    ['0', false],
    ['any', true],
    [{}, true],
    [0, false],
    ['', false],
  ])('%o => %o', (input, out) => {
    const { result } = renderHook(() => useToBoolean(input));

    expect(result.current).toBe(out);
  });
});
