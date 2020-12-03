import { getParser, Parser } from 'bowser';

/**
 * 用于处理浏览器UA相关问题的帮助函数
 */
export class BrowserHelper {
  parser: Parser.Parser;

  constructor(ua: string) {
    this.parser = getParser(ua);
  }

  /**
   * 获取浏览器名
   */
  getBrowserName(): string {
    return this.parser.getBrowserName();
  }

  /**
   * 获取浏览器版本
   */
  getBrowserVersion(): string {
    return this.parser.getBrowserVersion();
  }

  /**
   * 获取浏览器标记
   */
  getBrowserFlag(): string {
    let flag: string;

    if (this.parser.satisfies({ chrome: '>=0', chromium: '>=0' }))
      flag = 'chrome';
    else if (this.parser.satisfies({ firefox: '>=0' })) flag = 'firefox';
    else if (this.parser.satisfies({ safari: '>=0' })) flag = 'safari';
    else if (this.parser.satisfies({ opera: '>=0' })) flag = 'opera';
    else if (this.parser.satisfies({ 'microsoft edge': '>=0' })) flag = 'edge';
    else flag = 'unknown';

    return flag;
  }
}

export const browser = new BrowserHelper(navigator.userAgent);
