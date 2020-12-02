import bowser from 'bowser';

const ua = navigator.userAgent;
const browser = bowser.getParser(ua);

/**
 * 获取浏览器名
 */
export function getBrowserName(): string {
  return browser.getBrowserName();
}

/**
 * 获取浏览器版本
 */
export function getBrowserVersion(): string {
  return browser.getBrowserVersion();
}

/**
 * 获取浏览器标记
 */
export function getBrowserFlag(): string {
  let flag: string;

  if (browser.satisfies({ chrome: '>=0', chromium: '>=0' })) flag = 'chrome';
  else if (browser.satisfies({ firefox: '>=0' })) flag = 'firefox';
  else if (browser.satisfies({ safari: '>=0' })) flag = 'safari';
  else if (browser.satisfies({ opera: '>=0' })) flag = 'opera';
  else if (browser.satisfies({ 'microsoft edge': '>=0' })) flag = 'edge';
  else flag = 'unknown';

  return flag;
}
