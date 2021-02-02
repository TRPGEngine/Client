import parser from '../xml-parser';

describe('xml-parser', () => {
  test.each([
    [
      'normal',
      '<?xml version="1.0" encoding="utf-8" ?><Template></Template>',
      {
        declaration: { attributes: { version: '1.0', encoding: 'utf-8' } },
        elements: [{ type: 'element', name: 'Template' }],
      },
    ],
    [
      'nested',
      '<?xml version="1.0" encoding="utf-8" ?><Template><Static /></Template>',
      {
        declaration: {
          attributes: {
            encoding: 'utf-8',
            version: '1.0',
          },
        },
        elements: [
          {
            elements: [
              {
                name: 'Static',
                type: 'element',
              },
            ],
            name: 'Template',
            type: 'element',
          },
        ],
      },
    ],
  ])('%s', (name, xml, output) => {
    const obj = parser(xml);
    expect(obj).toMatchObject(output);
  });
});
