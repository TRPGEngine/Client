import { parseAttrStyle } from '@shared/components/layout/processor/style';

describe('parseAttrStyle should be ok', () => {
  test('normal', () => {
    expect(
      parseAttrStyle({
        style: 'color: red;',
      })
    ).toMatchObject({
      style: {
        color: 'red',
      },
    });

    expect(
      parseAttrStyle({
        style: 'color: red;',
        any: 'other',
      })
    ).toMatchObject({
      style: {
        color: 'red',
      },
      any: 'other',
    });
  });

  test('no style', () => {
    expect(
      parseAttrStyle({
        any: 'other',
      })
    ).toMatchObject({
      any: 'other',
    });
  });

  test('error style', () => {
    expect(
      parseAttrStyle({
        style: 'co',
        any: 'other',
      })
    ).toMatchObject({
      any: 'other',
    });
  });

  test('no semi', () => {
    expect(
      parseAttrStyle({
        style: 'color: red',
      })
    ).toMatchObject({
      style: {
        color: 'red',
      },
    });
  });
});
