import { generateSandboxContext, compileCode } from '../sandbox';

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

  test('sandbox in context', () => {
    const ret = compileCode('return global.a')({
      global: {
        a: 1,
      },
    });

    expect(ret).toBe(1);
  });

  test('sandbox in function', () => {
    const ret = compileCode('return global.add2(1, 2)')({
      global: {
        add2: compileCode('return function add(a, b) { return a + b }')({}),
      },
    });

    expect(ret).toBe(3);
  });

  test.only('sandbox in deep function', () => {
    const func = compileCode(
      'return function(a, b) { return global.add2(a, b) }'
    )({
      global: {
        add2: compileCode('return function add(a, b) { return a + b }')({}),
      },
    });

    expect(func(1, 2)).toBe(3);
  });
});
