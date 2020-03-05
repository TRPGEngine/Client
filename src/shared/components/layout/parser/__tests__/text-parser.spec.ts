import parseText from '../text-parser';

describe('parseText', () => {
  test('parseText simple', () => {
    const { expression, tokens } = parseText('{{any}}');
    expect(expression).toBe('(any)');
    expect(tokens).toMatchObject([{ '@binding': 'any' }]);
  });

  test('parseText deep', () => {
    const { expression, tokens } = parseText('{{any.other}}');
    expect(expression).toBe('(any.other)');
    expect(tokens).toMatchObject([{ '@binding': 'any.other' }]);
  });

  test('parseText mix', () => {
    const { expression, tokens } = parseText('str1{{any}}str2');
    expect(expression).toBe('"str1"+(any)+"str2"');
    expect(tokens).toMatchObject(['str1', { '@binding': 'any' }, 'str2']);
  });
});
