import { removePrivateProps } from '@shared/components/layout/tags/utils';

test('removePrivateProps', () => {
  const origin = {
    _a: 1,
    b: 1,
  };
  const target = removePrivateProps(origin);

  expect(target).toMatchObject({ b: 1 });
  expect(target).not.toEqual(origin);
});
