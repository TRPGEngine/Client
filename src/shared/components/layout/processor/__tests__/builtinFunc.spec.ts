import { getBuiltinFunc } from '../builtinFunc';

const { AND, SUM } = getBuiltinFunc();

describe('builtinFunc', () => {
  describe('AND', () => {
    test.each([
      [[1, 2], true],
      [[0, 2], false],
      [[true, true], true],
      [[true, false], false],
      [[false, true], false],
      [[false, false], false],
      [[false, 2], false],
      [[true, 2, true], true],
      [[true, 2, true, false], false],
    ])('%s => %s', (params: any[], result) => {
      expect(AND(...params)).toBe(result);
    });
  });

  describe('SUM', () => {
    test.each([
      [[1, 2], 3],
      [[0, 2], 2],
      [[false, 2], 2],
      [['', 2, 7], 9],
    ])('%s => %s', (params: any[], result: number) => {
      expect(SUM(...params)).toBe(result);
    });
  });
});
