import { generateShorterUrl } from '../url-helper';

describe('generateShorterUrl', () => {
  test.each<['http' | 'https', string, boolean]>([
    ['http', '80', false],
    ['http', '8080', true],
    ['https', '443', false],
    ['https', '4433', true],
  ])('%s,%s, %p', (protocol, port, withPort) => {
    const url = generateShorterUrl({
      protocol,
      host: 'example.com',
      port,
    });
    expect(url.includes(port)).toBe(withPort);
  });
});
