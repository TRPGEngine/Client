import styledTheme from '@shared/utils/theme';

describe('color', () => {
  test('antd color', () => {
    expect(styledTheme.color.antd.grey).toHaveProperty('primary');
    expect(styledTheme.color.antd.grey.length).toBe(10);
  });

  test('graySet', () => {
    expect(styledTheme.color.graySet.length).toBe(13);
  });
});
