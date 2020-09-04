import { buildTransparentColorWithHex } from '../color-helper';

describe('buildTransparentColorWithHex', () => {
  test.each<[number, string]>([
    [0, '#FFFFFF00'],
    [0.1, '#FFFFFF1A'],
    [0.2, '#FFFFFF33'],
    [0.3, '#FFFFFF4D'],
    [0.4, '#FFFFFF66'],
    [0.5, '#FFFFFF80'],
    [0.6, '#FFFFFF99'],
    [0.7, '#FFFFFFB3'],
    [0.8, '#FFFFFFCC'],
    [0.9, '#FFFFFFE6'],
    [1, '#FFFFFFFF'],
  ])('opacity: %s', (opacity, output) => {
    const res = buildTransparentColorWithHex('#FFFFFF', opacity);
    expect(res).toBe(output);
  });
});
