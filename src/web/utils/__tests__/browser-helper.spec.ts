import { BrowserHelper } from '../browser-helper';
import _zip from 'lodash/zip';

describe('browser-helper', () => {
  const desktopUA = [
    // Chrome浏览器
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    // Safari浏览器
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6',
    // Firefox浏览器
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:58.0) Gecko/20100101 Firefox/58.0',
    // QQ浏览器
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36 QQBrowser/4.3.4986.400',
    // Edge浏览器
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
    // IE11
    'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
    // IE10
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    // IE9
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    // IE8
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    // IE7
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
  ];

  const mobileUA = [
    // Safari浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0 Mobile/15D100 Safari/604.1',
    // Chrome浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) CriOS/64.0.3282.112 Mobile/15D100 Safari/604.1',
    // QQ内置浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D100 QQ/7.5.0.407 V1_IPH_SQ_7.5.0_1_APP_A Pixel/750 Core/UIWebView Device/Apple(iPhone 7) NetType/WIFI QBWebViewType/1',
    // QQ浏览器
    'Mozilla/5.0 (iPhone 91; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0 MQQBrowser/8.0.2 Mobile/15D100 Safari/8536.25 MttCustomUA/2 QBWebViewType/1 WKType/1',
    // UC浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/15D100 UCBrowser/11.8.8.1060 Mobile AliApp(TUnionSDK/0.1.20.2)',
    // WeChat内置浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D100 MicroMessenger/6.6.3 NetType/WIFI Language/zh_CN',
    // Baidu浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11. Mobile/15D100 Safari/600.1.4 baidubrowser/4.13.0.16 (Baidu; P2 11.2.6)',
    // Sougou浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D100 SogouMobileBrowser/5.11.10',
    // Weibo内置浏览器
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D100 Weibo (iPhone9,1__weibo__8.2.0__iphone__os11.2.6)',
  ];

  describe('Desktop', () => {
    describe.each(
      _zip(
        [...desktopUA, ...mobileUA],
        [
          'Chrome',
          'Safari',
          'Firefox',
          'QQ Browser',
          'Microsoft Edge',
          'Internet Explorer',
          'Internet Explorer',
          'Internet Explorer',
          'Internet Explorer',
          'Internet Explorer',
          'Safari',
          'Chrome',
          'Safari',
          'QQ Browser',
          'UC Browser',
          'WeChat',
          'Safari',
          'Safari',
          'Safari',
        ],
        [
          '64.0.3282.186',
          '11.0.3',
          '58.0',
          '4.3.4986.400',
          '13.10586',
          '11.0',
          '10.0',
          '9.0',
          '8.0',
          '7.0',
          '11.0',
          '64.0.3282.112',
          undefined,
          '8.0.2',
          '11.8.8.1060',
          '6.6.3',
          '11',
        ],
        [
          'chrome',
          'safari',
          'firefox',
          'unknown',
          'edge',
          'unknown',
          'unknown',
          'unknown',
          'unknown',
          'unknown',
          'safari',
          'chrome',
          'unknown',
          'unknown',
          'unknown',
          'unknown',
          'safari',
          'unknown',
          'unknown',
        ]
      )
    )('%#: %s', (ua, name, version, flag) => {
      const browser = new BrowserHelper(ua!);

      test(`getBrowserName => ${name}`, () => {
        expect(browser.getBrowserName()).toBe(name);
      });

      test(`getBrowserVersion => ${version}`, () => {
        expect(browser.getBrowserVersion()).toBe(version);
      });

      test(`getBrowserFlag => ${flag}`, () => {
        expect(browser.getBrowserFlag()).toBe(flag);
      });
    });
  });
});
