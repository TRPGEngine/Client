import { hpack, hunpack } from '@shared/utils/json-helper';

describe('json-helper', () => {
  describe.each([
    [
      [
        { a: 'A', b: 'B' },
        { a: 'C', b: 'D' },
      ],
      [2, 'a', 'b', 'A', 'B', 'C', 'D'],
    ],
  ])('%o | %o', (origin, packed) => {
    test('hpack', () => {
      expect(hpack(origin)).toMatchObject(packed);
    });
    test('hunpack', () => {
      expect(hunpack(packed)).toMatchObject(origin);
    });
  });
});
