import { getDefaultImage } from '@shared/assets';

describe('getDefaultImage', () => {
  const defaultImage = getDefaultImage({ fileUrl: '[fileUrl]' });

  test('snapshot', () => {
    expect(defaultImage).toMatchSnapshot();
  });
});
