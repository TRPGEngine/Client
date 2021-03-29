import { render } from '@testing-library/react';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { sleep } from '@test/utils';
import { XMLBuilderTester } from '@shared/components/layout/__tests__/utils';

const layout = String(fs.readFileSync(path.resolve(__dirname, '../coc7.xml')));

test('basic snapshot', async () => {
  const { container } = render(<XMLBuilderTester xml={layout} />);

  await sleep(100);

  expect(container).toMatchSnapshot();
});

describe('layout coc7', () => {
  describe('力量&体型 should calc correct 伤害加值&体格', () => {
    test.each([
      [
        200,
        200,
        {
          力量: 200,
          体型: 200,
          sumStrSiz: 400,
          baseDamage: '+4d6',
          baseBuild: '+5',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        10,
        10,
        {
          力量: 10,
          体型: 10,
          sumStrSiz: 20,
          baseDamage: '-2',
          baseBuild: '-2',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        40,
        40,
        {
          力量: 40,
          体型: 40,
          sumStrSiz: 80,
          baseDamage: '-1',
          baseBuild: '-1',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        50,
        50,
        {
          力量: 50,
          体型: 50,
          sumStrSiz: 100,
          baseDamage: '0',
          baseBuild: '0',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        70,
        70,
        {
          力量: 70,
          体型: 70,
          sumStrSiz: 140,
          baseDamage: '+1d4',
          baseBuild: '+1',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        90,
        90,
        {
          力量: 90,
          体型: 90,
          sumStrSiz: 180,
          baseDamage: '+1d6',
          baseBuild: '+2',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        120,
        120,
        {
          力量: 120,
          体型: 120,
          sumStrSiz: 240,
          baseDamage: '+2d6',
          baseBuild: '+3',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        160,
        150,
        {
          力量: 160,
          体型: 150,
          sumStrSiz: 310,
          baseDamage: '+3d6',
          baseBuild: '+4',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        200,
        200,
        {
          力量: 200,
          体型: 200,
          sumStrSiz: 400,
          baseDamage: '+4d6',
          baseBuild: '+5',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        250,
        250,
        {
          力量: 250,
          体型: 250,
          sumStrSiz: 500,
          baseDamage: '+5d6',
          baseBuild: '+6',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        300,
        300,
        {
          力量: 300,
          体型: 300,
          sumStrSiz: 600,
          baseDamage: '+5d6',
          baseBuild: '+6',
          addonDamage: '+1d6',
          addonBuild: '+1',
        },
      ],
      [
        400,
        400,
        {
          力量: 400,
          体型: 400,
          sumStrSiz: 800,
          baseDamage: '+5d6',
          baseBuild: '+6',
          addonDamage: '+4d6',
          addonBuild: '+4',
        },
      ],

      // 边缘case
      [
        300,
        224,
        {
          力量: 300,
          体型: 224,
          sumStrSiz: 524,
          baseDamage: '+5d6',
          baseBuild: '+6',
          addonDamage: '',
          addonBuild: '',
        },
      ],
      [
        300,
        225,
        {
          力量: 300,
          体型: 225,
          sumStrSiz: 525,
          baseDamage: '+5d6',
          baseBuild: '+6',
          addonDamage: '+1d6',
          addonBuild: '+1',
        },
      ],
      [
        -1,
        -1,
        {
          力量: -1,
          体型: -1,
          sumStrSiz: -2,
          baseDamage: '',
          baseBuild: '',
          addonDamage: '',
          addonBuild: '',
        },
      ],
    ])('力量: %d, 体型: %d => %p', async (arg1, arg2, output) => {
      let state = {};

      const _ = render(
        <XMLBuilderTester
          initialData={{ 力量: arg1, 体型: arg2 }}
          xml={layout}
          onChange={(newState) => (state = newState)}
        />
      );

      await sleep(100);

      expect(state).toMatchObject({
        data: output,
      });
    });
  });
});
