import { builtinFunc } from '../builtinFunc';

const { AND, SUM, _inRange } = builtinFunc;

describe('builtinFunc', () => {
  describe('AND', () => {
    test.each<[any[], boolean]>([
      [[1, 2], true],
      [[0, 2], false],
      [[true, true], true],
      [[true, false], false],
      [[false, true], false],
      [[false, false], false],
      [[false, 2], false],
      [[true, 2, true], true],
      [[true, 2, true, false], false],
    ])('%s => %s', (params, result) => {
      expect(AND(...params)).toBe(result);
    });
  });

  describe('SUM', () => {
    test.each<[any[], number]>([
      [[1, 2], 3],
      [[0, 2], 2],
      [[false, 2], 2],
      [['', 2, 7], 9],
    ])('%s => %s', (params, result) => {
      expect(SUM(...params)).toBe(result);
    });
  });

  describe('_inRange', () => {
    test.each<[any, boolean]>([
      [[10, 1, 20], true],
      [[30, 1, 20], false],
      [[1, 1, 20], true],
      [[20, 1, 20], false],
    ])('%s => %s', (params, result) => {
      expect(_inRange(params[0], params[1], params[2])).toBe(result);
    });
  });
});
