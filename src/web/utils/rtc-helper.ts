import bowser from 'bowser';

/**
 * 构建设备信息
 */
export function buildDeviceInfo() {
  const ua = navigator.userAgent;
  const browser = bowser.getParser(ua);
  let flag: string;

  if (browser.satisfies({ chrome: '>=0', chromium: '>=0' })) flag = 'chrome';
  else if (browser.satisfies({ firefox: '>=0' })) flag = 'firefox';
  else if (browser.satisfies({ safari: '>=0' })) flag = 'safari';
  else if (browser.satisfies({ opera: '>=0' })) flag = 'opera';
  else if (browser.satisfies({ 'microsoft edge': '>=0' })) flag = 'edge';
  else flag = 'unknown';

  return {
    flag,
    name: browser.getBrowserName(),
    version: browser.getBrowserVersion(),
  };
}
