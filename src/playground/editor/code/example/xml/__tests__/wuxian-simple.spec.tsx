import { render } from '@testing-library/react';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { sleep } from '@test/utils';
import { XMLBuilderTester } from '@shared/components/layout/__tests__/utils';

const layout = String(
  fs.readFileSync(path.resolve(__dirname, '../wuxian-simple.xml'))
);

test('basic snapshot', async () => {
  const { container } = render(<XMLBuilderTester xml={layout} />);

  await sleep(100);

  expect(container).toMatchSnapshot();
});
