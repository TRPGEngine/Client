import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';

// 用于处理原生模块的mock
jest.mock('../src/web/components/Image', () => 'mock-image');

/**
 * mock request
 */
const requestMockMapping: [string, any][] = [
  [
    '/info/website/info',
    {
      info: {
        title: 'mock title',
        content: 'mock content',
      },
    },
  ],
];
jest.mock('@shared/utils/request', () => {
  return (path: string) => {
    const specMock = requestMockMapping.find((item) =>
      path.startsWith(item[0])
    );
    if (!_isNil(specMock)) {
      return Promise.resolve({
        data: specMock[1],
      });
    }

    return Promise.resolve({
      data: null,
    });
  };
});

/**
 * mock console
 * 忽略部分错误提示。
 * https://github.com/airbnb/enzyme/issues/2073
 */
const mockConsoleMethod = (realConsoleMethod) => {
  const ignoredMessages = ['test was not wrapped in act(...)']; // 该问题在升级react 16.9似乎能解决，先忽略

  return (message, ...args) => {
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
