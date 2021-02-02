import {
  getASTObjectWithoutTagName,
  getASTObjectWithTagName,
} from '../tagname-helper';

describe('tagname-helper', () => {
  const originAST = {
    declaration: { attributes: { version: '1.0', encoding: 'utf-8' } },
    elements: [
      {
        type: 'element',
        name: 'Template',
        elements: [
          { type: 'element', name: 'Static' },
          { type: 'element', name: 'div' },
        ],
      },
    ],
  };
  test('getASTObjectWithTagName should be ok', () => {
    const ast = getASTObjectWithTagName(originAST, ['Static']);

    expect(ast).toMatchObject({
      declaration: { attributes: { version: '1.0', encoding: 'utf-8' } },
      elements: [
        {
          type: 'element',
          name: 'Template',
          elements: [{ type: 'element', name: 'Static' }],
        },
      ],
    });
  });

  test('getASTObjectWithoutTagName should be ok', () => {
    const ast = getASTObjectWithoutTagName(originAST, ['Static']);

    expect(ast).toMatchObject({
      declaration: { attributes: { version: '1.0', encoding: 'utf-8' } },
      elements: [
        {
          type: 'element',
          name: 'Template',
          elements: [{ type: 'element', name: 'div' }],
        },
      ],
    });
  });
});
