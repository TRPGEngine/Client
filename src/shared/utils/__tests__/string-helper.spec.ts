import {
  isAvailableString,
  isUrl,
  getDocsUrl,
  getPortalUrl,
} from '../string-helper';

describe('string-helper', () => {
  describe('isAvailableString', () => {
    test.each<[any, boolean]>([
      ['any string', true],
      ['', false],
      [1, false],
      [() => {}, false],
      [{}, false],
      [[], false],
      [undefined, false],
      [null, false],
    ])('%p => %p', (url, res) => {
      expect(isAvailableString(url)).toBe(res);
    });
  });

  describe('isUrl', () => {
    test.each<[string, boolean]>([
      ['http://baidu.com', true],
      ['https://baidu.com', true],
      ['ws://baidu.com', true],
      ['wss://baidu.com', true],
      ['baidu.com', false],
      ['baidu', false],
    ])('%s => %p', (url, res) => {
      expect(isUrl(url)).toBe(res);
    });
  });

  describe('getDocsUrl', () => {
    test.each<[string, string]>([
      [
        'https://trpgdoc.moonrailgun.com/a',
        'https://trpgdoc.moonrailgun.com/a',
      ],
      ['a', 'https://trpgdoc.moonrailgun.com/a'],
      ['/a', 'https://trpgdoc.moonrailgun.com/a'],
      ['/a/b', 'https://trpgdoc.moonrailgun.com/a/b'],
    ])('%s => %p', (url, res) => {
      expect(getDocsUrl(url)).toBe(res);
    });
  });

  describe('getPortalUrl', () => {
    test.each<[string, string]>([
      [
        'https://trpg.moonrailgun.com/portal/a',
        'https://trpg.moonrailgun.com/portal/a',
      ],
      ['a', 'https://trpg.moonrailgun.com/portal/a'],
      ['/a', 'https://trpg.moonrailgun.com/portal/a'],
      ['/a/b', 'https://trpg.moonrailgun.com/portal/a/b'],
    ])('%s => %p', (url, res) => {
      expect(getPortalUrl(url)).toBe(res);
    });
  });
});
