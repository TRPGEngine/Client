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
        somthing: 'other',
      })
    ).toMatchObject({
      style: {
        color: 'red',
      },
      somthing: 'other',
    });
  });

  test('no style', () => {
    expect(
      parseAttrStyle({
        somthing: 'other',
      })
    ).toMatchObject({
      somthing: 'other',
    });
  });

  test('error style', () => {
    expect(
      parseAttrStyle({
        style: 'co',
        somthing: 'other',
      })
    ).toMatchObject({
      somthing: 'other',
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
