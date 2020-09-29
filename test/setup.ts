import _noop from 'lodash/noop';

// 用于处理mock
jest.mock('@web/components/Image', () => 'mock-image');
jest.mock('@shared/i18n');
jest.mock('@shared/utils/request');

/**
 * mock console
 * 忽略部分错误提示。
 * https://github.com/airbnb/enzyme/issues/2073
 */
const mockConsoleMethod = (realConsoleMethod) => {
  const ignoredMessages = ['test was not wrapped in act(...)']; // 该问题在升级react 16.9似乎能解决，先忽略

  return (message, ...args) => {
    // 如果环境变量指定安静则不输出打印日志
    if (is(process.env.SILENT)) {
      return;
    }

    const containsIgnoredMessage = ignoredMessages.some((ignoredMessage) =>
      message.includes(ignoredMessage)
    );

    if (!containsIgnoredMessage) {
      realConsoleMethod(message, ...args);
    }
  };
};

console.warn = jest.fn(mockConsoleMethod(console.warn));
console.error = jest.fn(mockConsoleMethod(console.error));

/**
 * 用于判定环境变量的值
 */
function is(it?: string) {
  return !!it && it !== '0' && it !== 'false';
}
