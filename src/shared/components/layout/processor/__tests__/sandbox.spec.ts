import { generateSandboxContext } from '../sandbox';

describe('sandbox function', () => {
  const sandbox = generateSandboxContext({
    state: {
      defines: {},
      data: {},
      global: {},
    },
    dispatch: null,
    layoutType: 'edit',
  });

  test.each([
    [[1, 2, 3, 4, 5], 15],
    [[1, 2, null, undefined, 5], 8],
  ])('sum %o = %d', (nums: any[], res: number) => {
    expect(sandbox.SUM(...nums)).toBe(res);
  });
});
