import {
  getOperationData,
  removePrivateProps,
  tryToNumber,
} from '@shared/components/layout/tags/utils';

describe('getOperationData', () => {
  test.each([
    ['a', { scope: 'data', field: 'a' }],
    ['a.b', { scope: 'a', field: 'b' }],
    ['a.b.c', { scope: 'a', field: 'b.c' }],
    ['a.b.c.d', { scope: 'a', field: 'b.c.d' }],
  ])('%s', (input, output) => {
    expect(getOperationData(input)).toMatchObject(output);
  });
});

describe('tryToNumber', () => {
  test.each([
    ['', ''],
    [' 123', ' 123'],
    ['123456789123456789', '123456789123456789'],
    ['123456', 123456],
    [123456, 123456],
  ])('%s => %s', (input: any, output) => {
    expect(tryToNumber(input)).toBe(output);
  });
});

test('removePrivateProps', () => {
  const origin = {
    _a: 1,
    b: 1,
  };
  const target = removePrivateProps(origin);

  expect(target).toMatchObject({ b: 1 });
  expect(target).not.toEqual(origin);
});
