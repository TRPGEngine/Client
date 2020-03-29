import bbcodeParser from '../parser';

describe('bbcode parser', () => {
  test('simple text', () => {
    const ast = bbcodeParser.parse('text');

    expect(ast).toMatchObject(['text']);
  });

  test('simple text in []', () => {
    const ast = bbcodeParser.parse('[text]');

    expect(ast).toMatchObject(['[text]']);
  });

  test('non text in bbcode tag', () => {
    const ast = bbcodeParser.parse('[url][/url]');

    expect(ast).toMatchObject(['[url]']);
  });

  test('space char in bbcode tag', () => {
    const ast = bbcodeParser.parse('[url] [/url]');

    expect(ast).toMatchObject([
      {
        tag: 'url',
        attrs: {},
        content: [' '],
      },
    ]);
  });

  test('tag text', () => {
    const ast = bbcodeParser.parse('[url]a[/url]');

    expect(ast).toMatchObject([
      {
        tag: 'url',
        attrs: {},
        content: ['a'],
      },
    ]);
  });
});
